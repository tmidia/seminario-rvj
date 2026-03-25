import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { createExam, toggleExamStatus } from "@/app/actions/exams"

export default async function ProvasPage() {
  const supabase = createClient()
  
  const { data: subjects } = await supabase.from("subjects").select("*, courses(title)").order("course_id")
  
  const { data: exams } = await supabase
    .from("exams")
    .select("*, subjects(title, courses(title))")
    .order("id", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Gestão de Provas</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Criar Nova Prova</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createExam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Prova</Label>
                <Input id="title" name="title" required placeholder="Ex: Avaliação 01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject_id">Matéria</Label>
                <select id="subject_id" name="subject_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="">Selecione...</option>
                  {subjects?.map(s => (
                    <option key={s.id} value={s.id}>{s.courses?.title} - {s.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_limit_minutes">Tempo Limite (minutos)</Label>
                <Input id="time_limit_minutes" name="time_limit_minutes" type="number" defaultValue={60} required />
              </div>
              <Button type="submit" className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b]">
                Criar Prova
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Provas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Título</th>
                    <th className="px-4 py-3 font-medium">Matéria</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(!exams || exams.length === 0) && (
                    <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500">Nenhuma prova cadastrada.</td></tr>
                  )}
                  {exams?.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">{exam.title}</td>
                      <td className="px-4 py-3">{exam.subjects?.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {exam.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <form action={toggleExamStatus}>
                           <input type="hidden" name="exam_id" value={exam.id} />
                           <input type="hidden" name="is_active" value={exam.is_active ? 'false' : 'true'} />
                           <Button type="submit" variant="outline" size="sm">
                             {exam.is_active ? 'Desativar' : 'Ativar'}
                           </Button>
                        </form>
                        <Button asChild size="sm" className="bg-[#c29a4b] text-[#0a3a2a] hover:bg-[#c29a4b]/80">
                          <Link href={`/admin/provas/${exam.id}`}>Questões</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
