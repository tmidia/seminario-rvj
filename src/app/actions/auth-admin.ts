"use server"

import { createClient } from "@/utils/supabase/server"

export async function loginAdmin(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "E-mail e senha são obrigatórios." }
    }

    const supabase = createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return { 
        error: `Erro: ${signInError.message} (Status: ${signInError.status || 'N/A'})` 
      }
    }

    // After sign in, check if the user is actually an admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        // Sign out if not admin
        await supabase.auth.signOut()
        return { error: "Acesso negado. Usuário não é administrador." }
      }
    }

    return { success: true }
  } catch (err: unknown) {
    console.error("Erro crítico no loginAdmin:", err)
    
    // Specifically handle DNS/Network errors
    const errorMsg = err instanceof Error ? err.message : String(err)
    const errorCode = (err as { code?: string })?.code
    const errorCause = (err as { cause?: { code?: string } })?.cause?.code

    const isNetworkError = 
      errorMsg.toLowerCase().includes('fetch failed') || 
      errorCause === 'EAI_AGAIN' || 
      errorCode === 'EAI_AGAIN'

    if (isNetworkError) {
      return { 
        error: "Erro de Conexão: O servidor não conseguiu alcançar o Supabase (DNS/Network). Tente reiniciar o servidor ou verificar seu DNS." 
      }
    }
    
    return { error: `Erro inesperado: ${errorMsg}` }
  }
}
