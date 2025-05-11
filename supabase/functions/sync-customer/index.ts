
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncCustomerRequest {
  user_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { user_id } = await req.json() as SyncCustomerRequest;
    
    // Validar entrada
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();
    
    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Profile not found", details: profileError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Buscar endereço de entrega padrão
    const { data: shippingAddress, error: addressError } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("customer_id", user_id)
      .eq("is_default", true)
      .maybeSingle();
    
    // Verificar se o cliente já existe no sistema de gestão
    const { data: existingClient, error: clientCheckError } = await supabase
      .from("clients")
      .select("*")
      .eq("created_by", user_id) // Assumindo que clients tem um campo created_by para o ID do usuário
      .maybeSingle();
    
    let client;
    let isNewClient = false;
    
    if (!existingClient) {
      // Criar novo cliente no sistema de gestão
      const { data: newClient, error: createError } = await supabase
        .from("clients")
        .insert({
          name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
          email: profile.email,
          phone: shippingAddress?.phone || null,
          status: "cliente", // ou 'potencial' conforme necessário
          source: "ecommerce",
          created_by: user_id
        })
        .select()
        .single();
      
      if (createError) {
        return new Response(
          JSON.stringify({ error: "Failed to create client", details: createError }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      client = newClient;
      isNewClient = true;
    } else {
      client = existingClient;
      
      // Atualizar cliente existente
      const { error: updateError } = await supabase
        .from("clients")
        .update({
          name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
          email: profile.email,
          phone: shippingAddress?.phone || client.phone,
          updated_at: new Date().toISOString()
        })
        .eq("id", client.id);
      
      if (updateError) {
        console.error("Error updating client:", updateError);
      }
    }
    
    return new Response(
      JSON.stringify({
        client_id: client.id,
        is_new_client: isNewClient,
        profile: {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name
        },
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          status: client.status
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error syncing customer:", error);
    return new Response(
      JSON.stringify({ error: "Failed to sync customer", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
