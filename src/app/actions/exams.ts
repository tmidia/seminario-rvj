"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function createExam(data: FormData) {
  const supabase = createClient()
  const { data: adminData } = await supabase.auth.getUser()

  if (!adminData?.user) throw new Error("Não autorizado")

  const title = data.get("title") as string
  const subjectId = parseInt(data.get("subject_id") as string)
  const timeLimit = parseInt(data.get("time_limit_minutes") as string)

  const { error } = await supabase.from("exams").insert({
    title,
    subject_id: subjectId,
    time_limit_minutes: timeLimit,
    is_active: false
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/provas")
}

export async function toggleExamStatus(data: FormData) {
  const supabase = createClient()
  const examId = parseInt(data.get("exam_id") as string)
  const isActive = data.get("is_active") === "true"

  const { error } = await supabase.from("exams").update({ is_active: isActive }).eq("id", examId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/provas")
}

export async function addQuestion(data: FormData) {
  const supabase = createClient()
  
  const examId = parseInt(data.get("exam_id") as string)
  const text = data.get("text") as string
  const optA = data.get("optA") as string
  const optB = data.get("optB") as string
  const optC = data.get("optC") as string
  const optD = data.get("optD") as string
  const correctOption = data.get("correct_option") as string
  
  const options = { A: optA, B: optB, C: optC, D: optD }
  
  const { data: qData } = await supabase.from("questions").select("order_index").eq("exam_id", examId).order("order_index", { ascending: false }).limit(1)
  const orderIndex = qData && qData.length > 0 ? qData[0].order_index + 1 : 1

  const { error } = await supabase.from("questions").insert({
    exam_id: examId,
    text,
    options,
    correct_option: correctOption,
    order_index: orderIndex,
    points: 10
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/provas/${examId}`)
}

export async function deleteQuestion(data: FormData) {
  const supabase = createClient()
  const questionId = parseInt(data.get("question_id") as string)
  const examId = parseInt(data.get("exam_id") as string)

  const { error } = await supabase.from("questions").delete().eq("id", questionId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/provas/${examId}`)
}
