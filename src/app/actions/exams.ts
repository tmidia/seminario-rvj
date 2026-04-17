"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

export async function createExam(data: FormData) {
  try {
    const supabase = createClient()
    const adminSupabase = createAdminClient()
    const { data: adminData, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error("createExam: Erro de autenticação:", authError)
    }

    if (!adminData?.user) {
      console.error("createExam: Usuário não autenticado")
      return { success: false, error: "Não autorizado" }
    }

    const title = data.get("title") as string
    const subjectId = parseInt(data.get("subject_id") as string)
    const timeLimit = parseInt(data.get("time_limit_minutes") as string)

    console.log("createExam: Tentando inserir prova:", { title, subjectId, timeLimit })

    const { error } = await adminSupabase.from("exams").insert({
      title,
      subject_id: subjectId,
      time_limit_minutes: timeLimit,
      is_active: false
    })

    if (error) {
      console.error("createExam: Erro ao inserir no banco:", error)
      return { success: false, error: error.message }
    }

    console.log("createExam: Prova criada com sucesso")
    revalidatePath("/admin/provas")
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro inesperado ao criar prova"
    console.error("createExam: Erro inesperado:", err)
    return { success: false, error: errorMsg }
  }
}

export async function toggleExamStatus(data: FormData) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const examId = parseInt(data.get("exam_id") as string)
  const isActive = data.get("is_active") === "true"

  const { error } = await adminSupabase.from("exams").update({ is_active: isActive }).eq("id", examId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/provas")
}

export async function addQuestion(data: FormData) {
  try {
    const supabase = createClient()
    const adminSupabase = createAdminClient()
    const { data: adminData, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error("addQuestion: Erro de autenticação:", authError)
    }

    if (!adminData?.user) {
      console.error("addQuestion: Usuário não autenticado")
      return { success: false, error: "Não autorizado" }
    }
    
    const examId = parseInt(data.get("exam_id") as string)
    const text = data.get("text") as string
    const optA = data.get("optA") as string
    const optB = data.get("optB") as string
    const optC = data.get("optC") as string
    const optD = data.get("optD") as string
    const correctOption = data.get("correct_option") as string
    
    const options = { A: optA, B: optB, C: optC, D: optD }
    
    console.log("addQuestion: Buscando order_index para examId:", examId)
    
    const { data: qData, error: qError } = await adminSupabase
      .from("questions")
      .select("order_index")
      .eq("exam_id", examId)
      .order("order_index", { ascending: false })
      .limit(1)

    if (qError) {
      console.error("addQuestion: Erro ao buscar order_index:", qError)
      return { success: false, error: qError.message }
    }

    const orderIndex = qData && qData.length > 0 ? qData[0].order_index + 1 : 1
    
    console.log("addQuestion: Inserindo questão com orderIndex:", orderIndex)

    const { error: insError } = await adminSupabase.from("questions").insert({
      exam_id: examId,
      text,
      options,
      correct_option: correctOption,
      order_index: orderIndex,
      points: 10
    })

    if (insError) {
      console.error("addQuestion: Erro ao inserir questão:", insError)
      return { success: false, error: insError.message }
    }

    console.log("addQuestion: Questão adicionada com sucesso")
    revalidatePath(`/admin/provas/${examId}`)
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro inesperado ao adicionar questão"
    console.error("addQuestion: Erro inesperado:", err)
    return { success: false, error: errorMsg }
  }
}

export async function deleteQuestion(data: FormData) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const questionId = parseInt(data.get("question_id") as string)
  const examId = parseInt(data.get("exam_id") as string)

  const { error } = await adminSupabase.from("questions").delete().eq("id", questionId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/provas/${examId}`)
}

