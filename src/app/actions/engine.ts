"use server"

import { createClient } from "@/utils/supabase/server"

export async function submitExamAttempt(attemptId: string, examId: number) {
  const supabase = createClient()
  
  const { data: attempt } = await supabase.from('exam_attempts').select('*').eq('id', attemptId).single()
  if (!attempt || attempt.status === 'completed') return

  const { data: questions } = await supabase.from('questions').select('id, correct_option, points').eq('exam_id', examId)
  
  if (!questions) throw new Error("Questões não encontradas")

  let totalPoints = 0
  let earnedPoints = 0

  const userAnswers = attempt.answers || {}

  questions.forEach(q => {
    totalPoints += q.points || 10
    if (userAnswers[q.id.toString()] === q.correct_option) {
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
