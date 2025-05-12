
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
      // Verificar se o usuário existe pela listagem de usuários
      const { data, error } = await supabaseClient.auth.admin.listUsers()
      
      // Adicionar logs para depuração
      console.log("Check user results:", JSON.stringify({ data, error }))
      
      // Verificar se o usuário administrador existe entre os usuários listados
      const adminUser = data?.users?.find(user => user.email === email)
      const userExists = !!adminUser
      
      return new Response(
        JSON.stringify({ 
          exists: userExists,
          user: adminUser ? {
            id: adminUser.id,
            email: adminUser.email,
            created_at: adminUser.created_at,
            last_sign_in_at: adminUser.last_sign_in_at
          } : null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } 
    else if (action === "create") {
      // Criar usuário admin com confirmação de email
      const { data: userData, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: "Admin",
          last_name: "99Tattoo"
        }
      })

      // Adicionar logs para depuração
      console.log("Create user result:", JSON.stringify({ userData, createError }))

      if (createError) throw createError

      // Atualizar o perfil para ser admin
      if (userData && userData.user) {
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userData.user.id)

        if (updateError) {
          console.log("Error updating profile:", updateError)
          throw updateError
        } else {
          console.log("Profile updated successfully to admin role")
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Administrador criado com sucesso",
          user: userData?.user ? {
            id: userData.user.id,
            email: userData.user.email,
            created_at: userData.user.created_at
          } : null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    else if (action === "update_password") {
      // Primeiro obter o usuário
      const { data: users } = await supabaseClient.auth.admin.listUsers()

      if (!users || !users.users) {
        throw new Error("Não foi possível listar usuários")
      }

      const adminUser = users.users.find(user => user.email === email)

      if (!adminUser) {
        // Se o usuário não existe, vamos criá-lo
        console.log("Usuário administrador não encontrado, criando novo usuário")
        const { data: newUserData, error: createError } = await supabaseClient.auth.admin.createUser({
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
        if (newUserData && newUserData.user) {
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', newUserData.user.id)

          if (updateError) {
            console.log("Error updating profile:", updateError)
          }
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Administrador criado com sucesso", 
            created: true,
            user: newUserData?.user ? {
              id: newUserData.user.id,
              email: newUserData.user.email,
              created_at: newUserData.user.created_at
            } : null
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      // Atualizar a senha
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
        adminUser.id,
        { password }
      )

      // Adicionar logs para depuração
      console.log("Password update result:", updateError ? JSON.stringify(updateError) : "Success")

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Senha do administrador atualizada com sucesso",
          updated: true,
          user: {
            id: adminUser.id,
            email: adminUser.email,
            created_at: adminUser.created_at,
            updated_at: new Date().toISOString()
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    else {
      throw new Error("Ação inválida")
    }
  } catch (error) {
    console.error("Erro na função manage-admin:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    )
  }
})
