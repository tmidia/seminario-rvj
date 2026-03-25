import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import ExamEngine from "./ExamEngine"

export default async function ProvaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const examId = parseInt(params.id)
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: exam } = await supabase.from('exams').select('*, subjects(title)').eq('id', examId).single()
  if (!exam || !exam.is_active) return <div className="p-8 text-center text-red-500 font-bold">Prova indisponível.</div>

  const { data: questions } = await supabase.from('questions').select('*').eq('exam_id', examId).order('order_index')
  if (!questions || questions.length === 0) return <div className="p-8 text-center">Nenhuma questão cadastrada para esta prova.</div>

  let { data: attempt } = await supabase.from('exam_attempts').select('*').eq('user_id', user.id).eq('exam_id', examId).eq('status', 'in_progress').maybeSingle()
  
  if (!attempt) {
    const { data: newAttempt, error } = await supabase.from('exam_attempts').insert({
      user_id: user.id,
      exam_id: examId,
      status: 'in_progress',
      answers: {}
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
