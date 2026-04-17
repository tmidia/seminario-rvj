"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

export async function createCourse(data: FormData) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const title = data.get("title") as string
  if (!title) throw new Error("Título é obrigatório")

  const { error } = await adminSupabase.from("courses").insert({
    title
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/cursos")
  revalidatePath("/admin/materias")
}

export async function deleteCourse(data: FormData) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const courseId = parseInt(data.get("course_id") as string)

  const { error } = await adminSupabase.from("courses").delete().eq("id", courseId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/cursos")
  revalidatePath("/admin/materias")
}

export async function updateCourse(data: FormData) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const courseId = parseInt(data.get("course_id") as string)
  const title = data.get("title") as string

  const { error } = await adminSupabase.from("courses").update({ title }).eq("id", courseId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/cursos")
  revalidatePath("/admin/materias")
}
