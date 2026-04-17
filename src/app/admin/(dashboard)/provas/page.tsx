import { createAdminClient } from "@/utils/supabase/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { CreateExamForm } from "./CreateExamForm"
import { toggleExamStatus } from "@/app/actions/exams"

export const dynamic = "force-dynamic"

export default async function ProvasPage() {
  const supabase = createAdminClient()
  
  // Fetch subjects and exams in parallel
  const [
    { data: subjects },
    { data: exams }
  ] = await Promise.all([
    supabase.from("subjects").select("*, courses(title)").order("course_id"),
    supabase.from("exams").select("*, subjects(*)").order("id", { ascending: false })
  ])

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
            <CreateExamForm subjects={subjects || []} />
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
