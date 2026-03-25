import { createClient } from "@/utils/supabase/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function HistoricoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: attempts } = await supabase
    .from('exam_attempts')
    .select('*, exams(title, subjects(title))')
    .eq('user_id', user?.id)
    .order('finished_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Meu Histórico de Provas</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Avaliações Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
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
        </CardContent>
      </Card>
    </div>
  )
}
