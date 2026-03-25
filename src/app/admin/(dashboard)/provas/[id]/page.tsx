import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { addQuestion, deleteQuestion } from "@/app/actions/exams"
import { ArrowLeft, Trash2 } from "lucide-react"

export default async function QuestoesPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const examId = parseInt(params.id)
  
  const { data: exam } = await supabase.from("exams").select("*, subjects(title)").eq("id", examId).single()
  const { data: questions } = await supabase.from("questions").select("*").eq("exam_id", examId).order("order_index")

  if (!exam) return <div>Prova não encontrada</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/provas"><ArrowLeft size={18} /></Link>
        </Button>
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">
          Questões: {exam.title}
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Adicionar Questão</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addQuestion} className="space-y-4">
              <input type="hidden" name="exam_id" value={exam.id} />
              <div className="space-y-2">
                <Label htmlFor="text">Enunciado</Label>
                <textarea id="text" name="text" required className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[100px]" />
              </div>
              
              <div className="space-y-2">
                <Label>Alternativa A</Label>
                <Input name="optA" required />
              </div>
              <div className="space-y-2">
                <Label>Alternativa B</Label>
                <Input name="optB" required />
              </div>
              <div className="space-y-2">
                <Label>Alternativa C</Label>
                <Input name="optC" required />
              </div>
              <div className="space-y-2">
                <Label>Alternativa D</Label>
                <Input name="optD" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="correct_option">Alternativa Correta</Label>
                <select id="correct_option" name="correct_option" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b]">
                Adicionar Questão
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Questões Cadastradas ({questions?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!questions || questions.length === 0) && (
              <div className="p-8 text-center text-slate-500 border rounded-md bg-slate-50">
                Nenhuma questão nesta prova.
              </div>
            )}
            
            {questions?.map((q, i) => (
              <div key={q.id} className="border rounded-md p-4 relative bg-white">
                <div className="absolute right-4 top-4">
                  <form action={deleteQuestion}>
                    <input type="hidden" name="question_id" value={q.id} />
                    <input type="hidden" name="exam_id" value={exam.id} />
                    <Button type="submit" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 size={18} />
                    </Button>
                  </form>
                </div>
                <h4 className="font-semibold mb-3 pr-8">{i + 1}. {q.text}</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(q.options as Record<string, string>).map(([key, val]) => (
                    <div key={key} className={`flex gap-2 p-2 rounded-md ${key === q.correct_option ? 'bg-green-50 font-medium text-green-800 border-green-200 border' : 'text-slate-600'}`}>
                      <span className="font-bold">{key})</span> {val}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
