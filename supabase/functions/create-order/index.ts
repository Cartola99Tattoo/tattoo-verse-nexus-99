
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  order_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { order_id } = await req.json() as OrderRequest;
    
    // Validar ordem
    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "order_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Buscar detalhes do pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        customer:profiles!orders_customer_id_fkey(*),
        items:order_items(
          *,
          product:products(
            *,
            artist:artists(*)
          )
        ),
        scheduling_preferences:scheduling_preferences(*)
      `)
      .eq("id", order_id)
      .single();
    
    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found", details: orderError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Processamento em paralelo das diferentes integrações
    const [financialResult, appointmentResult, inventoryResult] = await Promise.allSettled([
      createFinancialTransaction(order),
      createAppointment(order),
      reserveInventoryItems(order)
    ]);
    
    // Preparar resultados
    const result = {
      order_id,
      financialTransaction: financialResult.status === 'fulfilled' ? financialResult.value : { error: "Failed to create financial transaction" },
      appointment: appointmentResult.status === 'fulfilled' ? appointmentResult.value : { error: "Failed to create appointment" },
      inventoryReservation: inventoryResult.status === 'fulfilled' ? inventoryResult.value : { error: "Failed to reserve inventory" },
    };
    
    // Atualizar o status do pedido se tudo estiver ok
    if (financialResult.status === 'fulfilled' && appointmentResult.status === 'fulfilled') {
      await supabase
        .from("orders")
        .update({ status: "processing" })
        .eq("id", order_id);
    }
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process order", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function createFinancialTransaction(order: any) {
  try {
    // Calcular total dos itens
    const totalAmount = order.total_amount;
    const customerName = `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || "Cliente";
    const description = `Venda Online #${order.reference_code} - ${customerName}`;
    
    // Criar transação financeira
    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert({
        type: "receita",
        amount: totalAmount,
        date: new Date().toISOString().split('T')[0], // Hoje
        description,
        category: "vendas_online",
        payment_method: order.payment_method,
        reference_number: order.reference_code,
        created_by: order.customer_id,
        reconciled: false,
        tags: ["venda_online", "ecommerce"]
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { transaction_id: transaction.id, success: true };
  } catch (error) {
    console.error("Error creating financial transaction:", error);
    return { error: error.message, success: false };
  }
}

async function createAppointment(order: any) {
  try {
    const tattooItems = order.items.filter((item: any) => item.product.artist_id);
    
    // Se não houver tatuagens com artistas, não criar agendamento
    if (tattooItems.length === 0) {
      return { message: "No tattoos with artists found in order", success: true };
    }
    
    // Pegar o primeiro artista para simplificar (pode-se expandir para múltiplos agendamentos)
    const firstTattooItem = tattooItems[0];
    const artistId = firstTattooItem.product.artist_id;
    const schedulingPrefs = order.scheduling_preferences;
    
    // Data preferida ou data atual + 7 dias
    const preferredDate = schedulingPrefs?.preferred_date_1 
      ? new Date(schedulingPrefs.preferred_date_1) 
      : new Date();
    
    if (!schedulingPrefs?.preferred_date_1) {
      preferredDate.setDate(preferredDate.getDate() + 7);
    }
    
    // Estimar duração (1 hora por item)
    const durationHours = tattooItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const durationMinutes = durationHours * 60;
    
    // Criar horário de término (inicialmente 1 hora depois)
    const endDate = new Date(preferredDate);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);
    
    // Criar agendamento
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        client_id: order.customer_id,
        artist_id: artistId,
        start_date: preferredDate.toISOString(),
        end_date: endDate.toISOString(),
        price: order.total_amount,
        status: "agendado", // ou 'pendente' se preferir confirmação manual
        description: `Tatuagem comprada online: ${firstTattooItem.product.name} - Ref #${order.reference_code}`,
        duration: durationMinutes
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Vincular o agendamento ao projeto
    await supabase
      .from("project_appointments")
      .insert({
        appointment_id: appointment.id,
        project_id: null // Pode-se criar um projeto automaticamente se necessário
      });
    
    return { appointment_id: appointment.id, success: true };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { error: error.message, success: false };
  }
}

async function reserveInventoryItems(order: any) {
  try {
    // Pegar todos os produtos do pedido
    const productIds = order.items.map((item: any) => item.product_id);
    
    // Buscar materiais necessários para esses produtos
    const { data: materials, error: materialsError } = await supabase
      .from("tattoo_materials")
      .select(`
        *,
        inventory_item:inventory_items(*)
      `)
      .in("product_id", productIds);
    
    if (materialsError) {
      throw materialsError;
    }
    
    // Se não encontrar materiais, retornar
    if (!materials || materials.length === 0) {
      return { message: "No materials found for these products", success: true };
    }
    
    // Agrupar por item de inventário para contabilizar quantidade total
    const inventoryUpdates = materials.reduce((acc: Record<string, number>, material: any) => {
      const inventoryItemId = material.inventory_item_id;
      const quantity = material.quantity * (order.items.find((item: any) => 
        item.product_id === material.product_id)?.quantity || 0);
      
      if (!acc[inventoryItemId]) {
        acc[inventoryItemId] = 0;
      }
      
      acc[inventoryItemId] += quantity;
      return acc;
    }, {});
    
    // Atualizar estoque para cada item
    const inventoryResults = [];
    
    for (const [itemId, quantity] of Object.entries(inventoryUpdates)) {
      // Primeiro verificar estoque atual
      const { data: inventoryItem, error: checkError } = await supabase
        .from("inventory_items")
        .select("quantity, name")
        .eq("id", itemId)
        .single();
      
      if (checkError) {
        inventoryResults.push({ 
          item_id: itemId, 
          error: "Failed to check inventory", 
          success: false 
        });
        continue;
      }
      
      // Verificar se há estoque suficiente
      if (inventoryItem.quantity < quantity) {
        inventoryResults.push({ 
          item_id: itemId, 
          name: inventoryItem.name,
          error: "Insufficient inventory", 
          requested: quantity,
          available: inventoryItem.quantity,
          success: false 
        });
        continue;
      }
      
      // Atualizar estoque
      const { error: updateError } = await supabase
        .from("inventory_items")
        .update({ 
          quantity: inventoryItem.quantity - quantity 
        })
        .eq("id", itemId);
      
      if (updateError) {
        inventoryResults.push({ 
          item_id: itemId, 
          error: "Failed to update inventory", 
          success: false 
        });
      } else {
        inventoryResults.push({ 
          item_id: itemId, 
          name: inventoryItem.name,
          quantity: quantity,
          remaining: inventoryItem.quantity - quantity,
          success: true 
        });
      }
    }
    
    return { 
      inventory_updates: inventoryResults,
      success: inventoryResults.every(result => result.success)
    };
  } catch (error) {
    console.error("Error reserving inventory:", error);
    return { error: error.message, success: false };
  }
}
