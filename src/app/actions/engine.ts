"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
 
export async function submitExamAttempt(attemptId: string, examId: number, answers?: Record<string, string>) {
  const adminSupabase = createAdminClient()
  
  try {
    // 1. If answers provided, sync them to DB using Admin Client (bypass RLS)
    if (answers) {
      const { error: syncError } = await adminSupabase.from('exam_attempts').update({ answers }).eq('id', attemptId)
      if (syncError) console.error("Erro na sincronia admin:", syncError)
    }

    const { data: attempt, error: fetchError } = await adminSupabase.from('exam_attempts').select('*').eq('id', attemptId).single()
    
    if (fetchError || !attempt) {
      console.error("Tentativa não encontrada:", attemptId, fetchError)
      return
    }

    if (attempt.status === 'completed') return

    const { data: questions } = await adminSupabase.from('questions').select('id, correct_option, points, options').eq('exam_id', examId)
    
    if (!questions || questions.length === 0) {
      console.error("Questões não encontradas para examId:", examId)
      throw new Error("Questões não encontradas")
    }

    let totalPoints = 0
    let earnedPoints = 0

    // Prefer using passed answers for immediate consistency, or fallback to DB
    const userAnswers = answers || attempt.answers || {}

    questions.forEach(q => {
      const questionPoints = q.points ?? 10
      totalPoints += questionPoints
      
      // Normalize options
      let normalizedOptions = q.options as Record<string, string>;
      if (Array.isArray(q.options)) {
        normalizedOptions = {
          A: q.options[0] || "",
          B: q.options[1] || "",
          C: q.options[2] || "",
          D: q.options[3] || ""
        };
      }

      const ansKey = userAnswers[q.id.toString()]
      
      // Mode 1: Exact Key Match (e.g. "A" === "A")
      // Use trim and ignore case for robust key matching
      let isCorrect = (ansKey?.trim().toUpperCase() === q.correct_option?.trim().toUpperCase())
      
      // Mode 2: Text Match (e.g. "Text String" === "Text String")
      if (!isCorrect && normalizedOptions && ansKey) {
        const selectedText = normalizedOptions[ansKey]?.trim()
        const correctText = q.correct_option?.trim()
        
        if (selectedText && correctText && selectedText.toLowerCase() === correctText.toLowerCase()) {
          isCorrect = true
        }
      }

      if (isCorrect) {
        earnedPoints += questionPoints
      }
    })

    const score = totalPoints === 0 ? 0 : (earnedPoints / totalPoints) * 10.0

    const { error: updateError } = await adminSupabase.from('exam_attempts').update({
      status: 'completed',
      finished_at: new Date().toISOString(),
      score: Number(score.toFixed(2))
    }).eq('id', attemptId)

    if (updateError) {
      console.error("Erro ao atualizar nota final:", updateError)
    }

    // Clear cache to ensure results show up in historical and dashboard
    revalidatePath('/aluno/dashboard')
    revalidatePath('/aluno/historico')
    revalidatePath(`/aluno/resultado/${attemptId}`)
    revalidatePath('/admin')

  } catch (error) {
    console.error("Erro crítico em submitExamAttempt:", error)
    throw error
  }
}

