import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import ExamEngine from "./ExamEngine"

export const dynamic = "force-dynamic"
 
export default async function ProvaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const examId = parseInt(params.id)
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: exam } = await adminSupabase.from('exams').select('*, subjects(title)').eq('id', examId).single()
  if (!exam || !exam.is_active) return <div className="p-8 text-center text-red-500 font-bold">Prova indisponível.</div>

  const { data: questions } = await adminSupabase.from('questions').select('*').eq('exam_id', examId).order('order_index')
  if (!questions || questions.length === 0) return <div className="p-8 text-center">Nenhuma questão cadastrada para esta prova.</div>

  let { data: attempt } = await adminSupabase
    .from('exam_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('exam_id', examId)
    .eq('status', 'in_progress')
    .maybeSingle()
  
  // Check if existing attempt is stale (expired)
  if (attempt) {
    const startTime = new Date(attempt.created_at || attempt.started_at).getTime()
    const now = new Date().getTime()
    const limitMs = (exam.time_limit_minutes + 5) * 60 * 1000 // 5 min buffer
    
    if (now - startTime > limitMs) {
      // Mark as completed/abandoned and nullify so we create a new one
      await adminSupabase.from('exam_attempts').update({ status: 'completed', score: 0 }).eq('id', attempt.id)
      attempt = null
    }
  }
  
  if (!attempt) {
    const { data: newAttempt, error } = await adminSupabase.from('exam_attempts').insert({
      user_id: user.id,
      exam_id: examId,
      status: 'in_progress',
      answers: {},
      started_at: new Date().toISOString()
    }).select().single()
    
    if (error) throw new Error("Erro ao iniciar tentativa: " + error.message)
    attempt = newAttempt
  }


  return (
    <div className="max-w-4xl mx-auto">
      <ExamEngine 
        attempt={attempt} 
        exam={exam} 
        questions={questions}
      />
    </div>
  )
}
