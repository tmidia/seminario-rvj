"use server"

import { revalidatePath } from "next/cache"
import { createClient as createServerClient } from "@/utils/supabase/server"

export async function createStudent(data: FormData) {
  const adminSupabase = createServerClient()
  const { data: adminData } = await adminSupabase.auth.getUser()

  if (!adminData?.user) throw new Error("Não autorizado")

  const rawCpf = data.get("cpf") as string
  const cpf = rawCpf.replace(/\D/g, '')
  const fullName = data.get("full_name") as string
  const courseIds = data.getAll("course_ids").map(id => parseInt(id as string))

  if (courseIds.length === 0) throw new Error("Selecione pelo menos um curso")

  // Use the native Postgres RPC to create the student and bypass Supabase Auth API Rate Limits (email rate limit)
  const { error: rpcError } = await adminSupabase.rpc('admin_create_student', {
    p_cpf: cpf,
    p_full_name: fullName,
    p_course_ids: courseIds
  })

  // The RPC function will safely insert or update the profile and remap the course_ids
  if (rpcError) {
    throw new Error(rpcError.message)
  }

  revalidatePath("/admin/alunos")
}
