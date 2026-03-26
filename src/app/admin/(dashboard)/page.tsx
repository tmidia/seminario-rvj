import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, FileText, GraduationCap, Activity, Award } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = createClient()
  
  // Basic Counts
  const { count: totalAlunos } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'aluno')
  const { count: totalProvas } = await supabase.from('exams').select('*', { count: 'exact', head: true })
  
  // Attempts Stats
  const { count: totalAttempts } = await supabase.from('exam_attempts').select('*', { count: 'exact', head: true })
  const { count: approvedAttempts } = await supabase.from('exam_attempts').select('*', { count: 'exact', head: true }).gte('score', 7)
  
  // Recent Activity Log
  const { data: recentAttempts } = await supabase
    .from('exam_attempts')
    .select('id, score, status, created_at, profiles(full_name, id), exams(title)')
    .order('created_at', { ascending: false })
    .limit(5)
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Dashboard</h1>
        <p className="text-slate-500 mt-1">Visão geral do desempenho do seminário.</p>
      </div>
      
      {/* Top Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-t-4 border-t-[#0a3a2a] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Alunos</CardTitle>
            <Users className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{totalAlunos || 0}</div>
            <p className="text-xs text-slate-400 mt-1">Alunos matriculados</p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-[#c29a4b] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Provas Ativas</CardTitle>
            <FileText className="w-4 h-4 text-[#c29a4b]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{totalProvas || 0}</div>
            <p className="text-xs text-slate-400 mt-1">No banco de dados</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Provas Realizadas</CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{totalAttempts || 0}</div>
            <p className="text-xs text-slate-400 mt-1">Tentativas totais dos alunos</p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Provas Aprovadas</CardTitle>
            <Award className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{approvedAttempts || 0}</div>
            <p className="text-xs text-slate-400 mt-1">Notas maiores que 7.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Section */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <GraduationCap className="text-[#0a3a2a]" /> Atividade Recente dos Alunos
            </CardTitle>
            <Link href="/admin/alunos" className="text-sm text-blue-600 hover:underline">Ver todos os alunos &rarr;</Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {(!recentAttempts || recentAttempts.length === 0) ? (
            <div className="p-8 text-center text-slate-500">Nenhuma prova foi realizada ainda pelos alunos.</div>
          ) : (
            <div className="divide-y">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {recentAttempts.map((attempt: any) => {
                const isCompleted = attempt.status === 'completed'
                const score = parseFloat(attempt.score || "0")
                const isPassed = score >= 7.0

                return (
                  <div key={attempt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800">
                          <Link href={`/admin/alunos/${attempt.profiles?.id}`} className="hover:text-blue-600 transition-colors">
                            {attempt.profiles?.full_name || 'Aluno Excluído'}
                          </Link>
                        </p>
                        {!isCompleted && <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-100 text-amber-700 rounded-full">Fazendo Agora</span>}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{attempt.exams?.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(attempt.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    
                    {isCompleted && (
                      <div className="mt-3 sm:mt-0 text-right">
                        <span className={`text-xl font-black ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                          {score.toFixed(1)}
                        </span>
                        <p className={`text-xs font-bold ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isPassed ? 'Aprovado' : 'Reprovado'}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
