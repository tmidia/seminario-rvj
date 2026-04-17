"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

export async function createSubject(data: FormData) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const title = data.get("title") as string
  const courseId = parseInt(data.get("course_id") as string)
  
  const { data: qData } = await adminSupabase.from("subjects").select("order_index").eq("course_id", courseId).order("order_index", { ascending: false }).limit(1)
  const orderIndex = qData && qData.length > 0 ? qData[0].order_index + 1 : 1

  const { error } = await adminSupabase.from("subjects").insert({
    title,
    course_id: courseId,
    order_index: orderIndex
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/materias")
  revalidatePath("/admin/provas")
}

export async function deleteSubject(data: FormData) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const subjectId = parseInt(data.get("subject_id") as string)

  const { error } = await adminSupabase.from("subjects").delete().eq("id", subjectId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/materias")
  revalidatePath("/admin/provas")
}

export async function updateSubject(data: FormData) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const subjectId = parseInt(data.get("subject_id") as string)
  const title = data.get("title") as string
  const orderIndex = parseInt(data.get("order_index") as string)

  const { error } = await adminSupabase.from("subjects").update({ title, order_index: orderIndex }).eq("id", subjectId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/materias")
  revalidatePath("/admin/provas")
}

