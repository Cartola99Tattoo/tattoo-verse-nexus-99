
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { 
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const { email, password, action } = await req.json()

    // Verificar se o email é realmente o adm99tattoo@gmail.com
    if (email !== "adm99tattoo@gmail.com") {
      return new Response(
        JSON.stringify({ error: "Configuração de administrador só é permitida para o e-mail oficial" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      )
    }

    if (action === "check") {
      const { data, error } = await supabaseClient.auth.admin.listUsers({
        filter: {
          email: email
        }
      })
      
      return new Response(
        JSON.stringify({ exists: data && data.users && data.users.length > 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } 
    else if (action === "create") {
      // Criar usuário admin
      const { data: userData, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: "Admin",
          last_name: "99Tattoo"
        }
      })

      if (createError) throw createError

      // Atualizar o perfil para ser admin
      if (userData && userData.user) {
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userData.user.id)

        if (updateError) throw updateError
      }

      return new Response(
        JSON.stringify({ success: true, message: "Administrador criado com sucesso" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    else if (action === "update_password") {
      // Primeiro obter o usuário
      const { data: users, error: listError } = await supabaseClient.auth.admin.listUsers({
        filter: {
          email: email
        }
      })

      if (listError) throw listError

      if (!users || !users.users || users.users.length === 0) {
        throw new Error("Usuário administrador não encontrado")
      }

      const adminUser = users.users[0]

      // Atualizar a senha
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
        adminUser.id,
        { password }
      )

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ success: true, message: "Senha do administrador atualizada com sucesso" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    else {
      throw new Error("Ação inválida")
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    )
  }
})
