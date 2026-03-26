"use server"

import { createClient } from "@/utils/supabase/server"

export async function submitExamAttempt(attemptId: string, examId: number) {
  const supabase = createClient()
  
  const { data: attempt } = await supabase.from('exam_attempts').select('*').eq('id', attemptId).single()
  if (!attempt || attempt.status === 'completed') return

  const { data: questions } = await supabase.from('questions').select('id, correct_option, points, options').eq('exam_id', examId)
  
  if (!questions) throw new Error("Questões não encontradas")

  let totalPoints = 0
  let earnedPoints = 0

  const userAnswers = attempt.answers || {}

  questions.forEach(q => {
    totalPoints += q.points || 10
    
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
    let isCorrect = (ansKey === q.correct_option)
    
    // Mode 2: Text Match (e.g. "Text String" === "Text String")
    if (!isCorrect && normalizedOptions && ansKey) {
      const selectedText = normalizedOptions[ansKey]
      if (selectedText === q.correct_option) {
        isCorrect = true
      }
    }

    if (isCorrect) {
      earnedPoints += q.points || 10
    }
  })

  const score = totalPoints === 0 ? 0 : (earnedPoints / totalPoints) * 10.0

  await supabase.from('exam_attempts').update({
    status: 'completed',
    finished_at: new Date().toISOString(),
    score: score.toFixed(2)
  }).eq('id', attemptId)
}
