import { createAdminClient } from "@/utils/supabase/admin"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, XCircle, Award } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminStudentDetailsPage({ params }: { params: { id: string } }) {
  // Use admin client to bypass RLS since this is a protected admin route
  const adminSupabase = createAdminClient()
  
  // 1. Fetch Student Profile
  const { data: student } = await adminSupabase
    .from("profiles")
    .select("*, enrollments(courses(*))")
    .eq("id", params.id)
    .single()

  if (!student) return notFound()

  // 2. Fetch Exam Attempts with a more direct join
  const { data: attempts, error: attemptsError } = await adminSupabase
    .from("exam_attempts")
    .select(`
      *,
      exams:exam_id (
        title,
        subject:subject_id (
          title
        )
      )
    `)
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })

  if (attemptsError) {
    console.error("Erro ao buscar histórico:", attemptsError)
  }

  // 3. Fetch Certificate Status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studentCourses = student.enrollments?.map((e: any) => e.courses?.id) || []
  let certificateCourseId = null
  
  if (studentCourses.length > 0) {
    certificateCourseId = studentCourses[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/alunos" className="p-2 bg-white rounded-full border shadow-sm hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0a3a2a]">Histórico Acadêmico</h1>
          <p className="text-slate-500">{student.full_name} • CPF: {student.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 shadow-sm border-t-4 border-t-[#c29a4b]">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Aluno</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium">Status da Conta</p>
              <span className={`inline-block mt-1 px-2 py-1 text-xs font-bold uppercase rounded-full ${student.status === 'inativo' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {student.status || 'ativo'}
              </span>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Cursos Matriculados</p>
              <ul className="mt-1 list-disc pl-5">
                {student.enrollments?.length ? (
                  student.enrollments.map((e: { courses: { id: number, title: string } }) => <li key={e.courses.id} className="font-semibold text-slate-800">{e.courses.title}</li>)
                ) : (
                  <li className="text-slate-400">Nenhum curso</li>
                )}
              </ul>
            </div>
            {certificateCourseId && (
              <div className="pt-4 border-t">
                <Link href={`/aluno/certificado/${certificateCourseId}`} target="_blank" className="flex items-center justify-center gap-2 p-3 bg-[#0a3a2a] text-white rounded-lg hover:bg-[#0a3a2a]/90 font-medium transition-colors">
                  <Award size={18} />
                  Simular Certificado do Aluno
                </Link>
                <p className="text-xs text-slate-400 mt-2 text-center">Permite ver o PDF exatamente como o aluno vê.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Provas e Tentativas</CardTitle>
          </CardHeader>
          <CardContent>
            {(!attempts || attempts.length === 0) ? (
              <div className="text-center p-8 bg-slate-50 border rounded-lg border-dashed">
                 <p className="text-slate-500">Este aluno ainda não tentou responder nenhuma prova.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attempts.map(attempt => {
                  const score = parseFloat(attempt.score || "0")
                  const isPassed = score >= 7.0
                  const isCompleted = attempt.status === 'completed'
                  
                  return (
                    <div key={attempt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white relative overflow-hidden">
                      {isCompleted ? (
                         <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      ) : (
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                      )}
                      
                      <div className="mb-2 sm:mb-0 pl-2">
                        <h4 className="font-bold text-slate-800">{attempt.exams?.title}</h4>
                        <div className="text-xs font-mono text-slate-500 mt-1 flex items-center gap-2">
                          <span>{new Date(attempt.created_at).toLocaleString('pt-BR')}</span>
                          {isCompleted && attempt.finished_at && (
                             <span>• Finalizada em: {new Date(attempt.finished_at).toLocaleString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 pl-2">
                        {!isCompleted ? (
                           <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                             <Clock size={16} /> Fazendo Agora
                           </div>
                        ) : (
                           <div className="text-right">
                             <div className={`text-2xl font-black ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                               {score.toFixed(1)}
                             </div>
                             <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                               {isPassed ? <><CheckCircle2 size={12}/> Aprovado</> : <><XCircle size={12}/> Reprovado</>}
                             </div>
                           </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
