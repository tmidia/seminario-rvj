import { createClient } from "@/utils/supabase/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Award, Lock } from "lucide-react"
import Link from "next/link"

export default async function HistoricoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, enrollments(courses(id, title, subjects(id)))')
    .eq('id', user?.id)
    .single()

  const { data: attempts } = await supabase
    .from('exam_attempts')
    .select('*, exams(subject_id, title, subjects(title))')
    .eq('user_id', user?.id)
    .order('finished_at', { ascending: false })

  // Validate which courses are fully completed
  const coursesStatus: { id: number, title: string, isCompleted: boolean, passedCount: number, totalCount: number }[] = []
  
  if (profile?.enrollments) {
    const passedSubjectIds = new Set(
      attempts
        ?.filter(a => a.status === 'completed' && a.score !== null && parseFloat(a.score) >= 7.0)
        .map(a => a.exams?.subject_id) || []
    )

    profile.enrollments.forEach((enrollment: { courses: { id: number, title: string, subjects: { id: number }[] } }) => {
      const course = enrollment.courses
      if (!course || !course.subjects || course.subjects.length === 0) return
      
      const totalCount = course.subjects.length
      const passedCount = course.subjects.filter((sub: { id: number }) => passedSubjectIds.has(sub.id)).length
      const isCompleted = passedCount === totalCount
      
      coursesStatus.push({ id: course.id, title: course.title, isCompleted, passedCount, totalCount })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Meu Histórico de Provas</h1>
      </div>

      {coursesStatus.map(course => (
        <Card key={course.id} className={`overflow-hidden border-2 shadow-xl ${course.isCompleted ? 'bg-gradient-to-br from-[#0a3a2a] to-[#0d4a36] border-[#c29a4b]' : 'bg-white border-slate-200'}`}>
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className={`flex items-center gap-4 ${course.isCompleted ? 'text-white' : 'text-slate-800'}`}>
              <div className={`p-3 rounded-full ${course.isCompleted ? 'bg-[#c29a4b]/20 text-[#c29a4b]' : 'bg-slate-100 text-slate-400'}`}>
                {course.isCompleted ? <Award size={40} /> : <Lock size={40} />}
              </div>
              <div>
                <h2 className={`text-2xl font-bold font-serif ${course.isCompleted ? 'text-[#c29a4b]' : 'text-slate-500'}`}>
                  {course.isCompleted ? 'Parabéns!' : 'Certificado Final'}
                </h2>
                {course.isCompleted ? (
                  <p className="text-slate-200 mt-1">Você concluiu com sucesso todas as matérias do curso <strong className="text-white">{course.title}</strong>.</p>
                ) : (
                  <p className="text-slate-500 mt-1">Conclua as matérias do curso <strong className="text-slate-700">{course.title}</strong> para liberar seu certificado. ({course.passedCount}/{course.totalCount} concluídas)</p>
                )}
              </div>
            </div>
            {course.isCompleted ? (
              <Link href={`/aluno/certificado/${course.id}`} className="w-full md:w-auto">
                <button className="w-full md:w-auto px-8 py-4 bg-[#c29a4b] hover:bg-[#b08b40] text-[#0a3a2a] rounded-lg font-black tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Emitir Certificado
                </button>
              </Link>
            ) : (
              <button disabled className="w-full md:w-auto px-8 py-4 bg-slate-100 text-slate-400 rounded-lg font-bold tracking-widest uppercase border border-slate-200 cursor-not-allowed">
                Bloqueado
              </button>
            )}
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardHeader>
          <CardTitle>Avaliações Realizadas</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium border-r">Data de Término</th>
                  <th className="px-4 py-3 font-medium">Matéria</th>
                  <th className="px-4 py-3 font-medium">Prova</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Nota Final</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(!attempts || attempts.length === 0) && (
                  <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-500">Nenhum histórico encontrado.</td></tr>
                )}
                {attempts?.map((attempt) => {
                  const score = attempt.score !== null ? parseFloat(attempt.score) : null
                  const isApproved = score !== null && score >= 7.0
                  return (
                    <tr key={attempt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 border-r">{attempt.finished_at ? new Date(attempt.finished_at).toLocaleString('pt-BR') : 'Em andamento'}</td>
                      <td className="px-4 py-3">{attempt.exams?.subjects?.title}</td>
                      <td className="px-4 py-3">{attempt.exams?.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${attempt.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {attempt.status === 'completed' ? 'Finalizada' : 'Em Andamento'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {score !== null ? (
                          <span className={isApproved ? "text-green-600" : "text-red-600"}>
                            {score.toFixed(1)} {isApproved ? '(Aprovado)' : '(Reprovado)'}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack View */}
          <div className="md:hidden flex flex-col divide-y divide-slate-100">
            {(!attempts || attempts.length === 0) && (
              <div className="p-6 text-center text-slate-500 text-sm">Nenhum histórico encontrado.</div>
            )}
            {attempts?.map((attempt) => {
              const score = attempt.score !== null ? parseFloat(attempt.score) : null
              const isApproved = score !== null && score >= 7.0
              return (
                <div key={attempt.id} className="p-5 flex flex-col gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-tight">{attempt.exams?.subjects?.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{attempt.exams?.title}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${attempt.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {attempt.status === 'completed' ? 'Finalizada' : 'Andamento'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Execução</p>
                      <p className="text-xs text-slate-600 font-medium">
                        {attempt.finished_at ? new Date(attempt.finished_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Aguardando'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Sua Nota</p>
                      <p className="font-black text-lg leading-none">
                        {score !== null ? (
                          <span className={isApproved ? "text-green-600" : "text-red-600"}>
                            {score.toFixed(1)} <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{isApproved ? 'Aprovado' : 'Reprovado'}</span>
                          </span>
                        ) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
