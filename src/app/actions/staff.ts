"use server"

import { revalidatePath } from "next/cache"
import { createClient as createServerClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

export async function createStaff(data: FormData) {
  const reqClient = createServerClient()
  const { data: userData } = await reqClient.auth.getUser()

  if (!userData?.user) throw new Error("Não autorizado")

  // Check if caller is Admin
  const { data: profile } = await reqClient.from('profiles').select('role').eq('id', userData.user.id).single()
  if (profile?.role !== 'admin') throw new Error("Permissão negada")

  const email = data.get("email") as string
  const password = data.get("password") as string
  const fullName = data.get("full_name") as string
  const role = data.get("role") as string // 'admin' or 'professor'

  if (!email || !password || !fullName || !role) throw new Error("Preencha todos os campos")
  if (password.length < 6) throw new Error("A senha deve ter no mínimo 6 caracteres")

  const adminClient = createAdminClient()

  // Create user in Auth
  const { data: newAuthUser, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  })

  if (authError || !newAuthUser.user) {
    throw new Error(authError?.message || "Erro ao criar usuário Auth")
  }

  // Insert profile explicitly
  const { error: profileError } = await adminClient.from('profiles').insert({
    id: newAuthUser.user.id,
    full_name: fullName,
    role: role
  })

  if (profileError) {
    // Attempt rollback
    await adminClient.auth.admin.deleteUser(newAuthUser.user.id)
    throw new Error("Erro ao criar perfil. Usuário Auth removido.")
  }

  revalidatePath("/admin/usuarios")
}

export async function deleteStaff(userId: string) {
  const reqClient = createServerClient()
  const { data: userData } = await reqClient.auth.getUser()
  if (!userData?.user) throw new Error("Não autorizado")

  const { data: profile } = await reqClient.from('profiles').select('role').eq('id', userData.user.id).single()
  if (profile?.role !== 'admin') throw new Error("Permissão negada")

  if (userId === userData.user.id) throw new Error("Não é possível excluir a si mesmo.")

  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(userId)
  
  if (error) throw new Error(error.message)
  
  revalidatePath("/admin/usuarios")
}
