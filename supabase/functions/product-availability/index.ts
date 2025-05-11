
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProductAvailabilityRequest {
  product_id: string;
  start_date?: string;
  end_date?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { product_id, start_date, end_date } = await req.json() as ProductAvailabilityRequest;
    
    // Validar entrada
    if (!product_id) {
      return new Response(
        JSON.stringify({ error: "product_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Buscar produto e seu artista
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(`
        *,
        artist:artists(*)
      `)
      .eq("id", product_id)
      .single();
    
    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: "Product not found", details: productError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verificar disponibilidade de materiais
    const { data: materials, error: materialsError } = await supabase
      .from("tattoo_materials")
      .select(`
        *,
        inventory_item:inventory_items(*)
      `)
      .eq("product_id", product_id);
    
    if (materialsError) {
      return new Response(
        JSON.stringify({ error: "Error fetching materials", details: materialsError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verificar disponibilidade do artista
    let artistAvailability = { available: true, message: "Artista disponível" };
    
    // Se o produto tem um artista associado
    if (product.artist_id) {
      // Verificar se o artista está disponível em geral
      if (!product.artist.available) {
        artistAvailability = {
          available: false,
          message: "O artista não está disponível para novos agendamentos"
        };
      } 
      // Se datas foram especificadas, verificar agendamentos existentes
      else if (start_date && end_date) {
        const { data: appointments, error: appointmentsError } = await supabase
          .from("appointments")
          .select("*")
          .eq("artist_id", product.artist_id)
          .lt("start_date", end_date)
          .gt("end_date", start_date);
        
        if (appointmentsError) {
          return new Response(
            JSON.stringify({ error: "Error checking artist availability", details: appointmentsError }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        if (appointments && appointments.length > 0) {
          artistAvailability = {
            available: false,
            message: "O artista já tem compromissos nesse horário",
            conflicts: appointments.map(a => ({
              start: a.start_date,
              end: a.end_date
            }))
          };
        }
      }
    }
    
    // Verificar disponibilidade de materiais
    const materialsAvailability = materials.map((material: any) => {
      const inventoryItem = material.inventory_item;
      const isAvailable = inventoryItem.quantity >= material.quantity;
      
      return {
        name: inventoryItem.name,
        required: material.quantity,
        available: inventoryItem.quantity,
        is_available: isAvailable
      };
    });
    
    const allMaterialsAvailable = materialsAvailability.every(m => m.is_available);
    
    return new Response(
      JSON.stringify({
        product: {
          id: product.id,
          name: product.name,
          status: product.status,
          is_available: product.status === "available"
        },
        artist: {
          id: product.artist?.id,
          name: product.artist?.name,
          available: artistAvailability.available,
          message: artistAvailability.message,
          conflicts: artistAvailability.conflicts
        },
        materials: {
          items: materialsAvailability,
          all_available: allMaterialsAvailable
        },
        overall_availability: product.status === "available" && 
                              (!product.artist_id || artistAvailability.available) && 
                              allMaterialsAvailable
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking product availability:", error);
    return new Response(
      JSON.stringify({ error: "Failed to check product availability", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
