import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createSubject, deleteSubject, updateSubject } from "@/app/actions/subjects"
import { Trash2, Save } from "lucide-react"

export default async function MateriasPage() {
  const supabase = createClient()
  
  const { data: courses } = await supabase.from("courses").select("*").order("id")
  const { data: subjects } = await supabase.from("subjects").select("*, courses(title)").order("course_id").order("order_index")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Gestão de Matérias</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Nova Matéria</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createSubject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Matéria</Label>
                <Input id="title" name="title" required placeholder="Ex: Bibliologia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course_id">Curso</Label>
                <select id="course_id" name="course_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="">Selecione...</option>
                  {courses?.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b]">
                Criar Matéria
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Matérias Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium cursor-pointer">Curso</th>
                    <th className="px-4 py-3 font-medium">Ordem</th>
                    <th className="px-4 py-3 font-medium w-full">Título</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(!subjects || subjects.length === 0) && (
                    <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500">Nenhuma matéria cadastrada.</td></tr>
                  )}
                  {subjects?.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-2 align-middle font-medium text-slate-700 whitespace-nowrap">{sub.courses?.title}</td>
                      <td className="px-4 py-2 align-middle" colSpan={2}>
                        <form action={updateSubject} className="flex items-center gap-2">
                          <input type="hidden" name="subject_id" value={sub.id} />
                          <Input 
                            name="order_index" 
                            type="number" 
                            defaultValue={sub.order_index} 
                            className="w-16 h-9 text-center px-1" 
                            required 
                          />
                          <Input 
                            name="title" 
                            defaultValue={sub.title} 
                            className="h-9 flex-1 min-w-[200px]" 
                            required 
                          />
                          <Button type="submit" variant="ghost" size="icon" title="Salvar Edição" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <Save size={16} />
                          </Button>
                        </form>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <form action={deleteSubject}>
                          <input type="hidden" name="subject_id" value={sub.id} />
                          <Button type="submit" variant="ghost" size="icon" title="Excluir" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        </form>
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
