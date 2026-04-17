import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Lock, PlayCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AlunoDashboard() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('*, enrollments(course_id, courses(title))')
    .eq('id', user?.id)
    .single()
  
  if (!profile) return (
    <div className="p-12 text-center space-y-4">
      <AlertCircle className="mx-auto text-amber-500" size={48} />
      <h2 className="text-xl font-bold">Perfil não localizado</h2>
      <p className="text-slate-500">Não conseguimos carregar seus dados de aluno (ID: {user?.id?.substring(0,8)}...). Por favor, contate o administrador.</p>
      <Button asChild variant="outline">
        <Link href="/auth/login">Voltar para Login</Link>
      </Button>
    </div>
  )

  const courseIds = profile.enrollments?.map((e: { course_id: number }) => e.course_id) || []
  const courseTitles = profile.enrollments?.map((e: { courses: { title: string } }) => e.courses?.title).join(" e ")

  // Parallelize subjects and attempts
  const [
    { data: subjects },
    { data: attempts }
  ] = await Promise.all([
    adminSupabase.from('subjects').select('*, exams(*)').in('course_id', courseIds).order('course_id').order('order_index'),
    adminSupabase.from('exam_attempts').select('exam_id, score, status').eq('user_id', profile.id).eq('status', 'completed')
  ])


  const highestScores: Record<number, number> = {}
  attempts?.forEach(a => {
    if (a.score !== null) {
      if (!highestScores[a.exam_id] || a.score > highestScores[a.exam_id]) {
        highestScores[a.exam_id] = parseFloat(a.score as unknown as string)
      }
    }
  })

  let isNextUnlocked = true

  return (
    <div className="space-y-8 pb-16 md:pb-0">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0a3a2a]">Bem-vindo(a), {profile.full_name.split(' ')[0]}</h2>
          <p className="text-slate-500 mt-1">{courseTitles}</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm text-slate-500">Progresso Geral</p>
          <p className="text-3xl font-bold text-[#c29a4b]">
            {Object.values(highestScores).filter(s => s >= 7).length} <span className="text-xl text-slate-400">/ {subjects?.length || 12}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects?.map((sub) => {
          const exam = sub.exams && sub.exams.find((e: { is_active: boolean }) => e.is_active)
          const highestScore = exam ? highestScores[exam.id] : undefined
          const isApproved = highestScore !== undefined && highestScore >= 7.0
          
          const isUnlocked = isNextUnlocked
          
          if (isUnlocked) {
            isNextUnlocked = isApproved // Progression lock logic
          }

          return (
            <Card key={sub.id} className={`relative overflow-hidden transition-all ${isUnlocked ? 'border-[#0a3a2a]/20 shadow-md hover:-translate-y-1 hover:shadow-lg' : 'opacity-80 bg-slate-50'}`}>
              {!isUnlocked && (
                <div className="absolute inset-0 bg-slate-100/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-white p-4 rounded-full shadow-sm text-slate-300">
                    <Lock size={28} />
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="text-xs font-bold tracking-wider text-[#c29a4b] uppercase mb-1">Módulo {sub.order_index}</div>
                <CardTitle className="leading-tight text-lg">{sub.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-4">
                {isApproved ? (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle2 size={18} />
                    <span>Aprovado (Nota: {highestScore?.toFixed(1)})</span>
                  </div>
                ) : highestScore !== undefined ? (
                  <div className="flex items-center gap-2 text-amber-600 font-medium">
                    <AlertCircle size={18} />
                    <span>Requer {7.0 - highestScore} pt(s) para aprovar</span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm">
                    Nenhuma tentativa realizada
                  </div>
                )}
                
                {!exam && isUnlocked && (
                   <div className="text-red-500 text-xs mt-2 font-medium">Avaliação em construção pelo professor.</div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0">
                {isUnlocked && exam ? (
                  <Button asChild className="w-full bg-[#0a3a2a] shadow-sm hover:shadow hover:bg-[#0a3a2a]/90">
                    <Link href={`/aluno/prova/${exam.id}`} className="flex gap-2 items-center">
                      <PlayCircle size={18} /> {isApproved ? 'Refazer P/ Maior Nota' : 'Acessar Prova'}
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full" variant="outline">{isUnlocked ? 'Sem Avaliação' : 'Módulo Bloqueado'}</Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
