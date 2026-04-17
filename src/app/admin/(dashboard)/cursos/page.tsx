import { createAdminClient } from "@/utils/supabase/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createCourse, deleteCourse, updateCourse } from "@/app/actions/courses"
import { Trash2, Save } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CursosPage() {
  const supabase = createAdminClient()
  
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("id")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Gestão de Cursos</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Novo Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCourse} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Curso</Label>
                <Input id="title" name="title" required placeholder="Ex: Curso Médio de Teologia" />
              </div>
              <Button type="submit" className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b]">
                Criar Curso
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cursos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium w-full">Título</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(!courses || courses.length === 0) && (
                    <tr><td colSpan={3} className="px-4 py-4 text-center text-slate-500">Nenhum curso cadastrado.</td></tr>
                  )}
                  {courses?.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-2 align-middle font-medium text-slate-700">{course.id}</td>
                      <td className="px-4 py-2 align-middle">
                        <form action={updateCourse} className="flex items-center gap-2">
                          <input type="hidden" name="course_id" value={course.id} />
                          <Input 
                            name="title" 
                            defaultValue={course.title} 
                            className="h-9 flex-1 min-w-[200px]" 
                            required 
                          />
                          <Button type="submit" variant="ghost" size="icon" title="Salvar Edição" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <Save size={16} />
                          </Button>
                        </form>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <form action={deleteCourse}>
                          <input type="hidden" name="course_id" value={course.id} />
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
