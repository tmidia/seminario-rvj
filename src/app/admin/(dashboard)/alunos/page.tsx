import { createClient } from "@/utils/supabase/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StudentForm } from "./ClientForm"

export default async function AlunosPage() {
  const supabase = createClient()
  const { data: alunos, error: alunosError } = await supabase
    .from("profiles")
    .select("*, enrollments(courses(title))")
    .eq("role", "aluno")
    .order("created_at", { ascending: false })

  const { data: courses } = await supabase.from("courses").select("*")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Alunos</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Adicionar ou Editar Aluno</CardTitle>
            <p className="text-sm text-slate-500">
              Digite o CPF de um aluno existente para atualizar seus cursos matriculados.
            </p>
          </CardHeader>
          <CardContent>
            <StudentForm courses={courses || []} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Alunos Matriculados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">CPF</th>
                    <th className="px-4 py-3 font-medium">Curso</th>
                    <th className="px-4 py-3 font-medium">Data de Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(!alunos || alunos.length === 0) && (
                    <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500">
                      {alunosError ? `Erro BD: ${alunosError.message}` : 'Nenhum aluno cadastrado.'}
                    </td></tr>
                  )}
                  {alunos?.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">{aluno.full_name}</td>
                      <td className="px-4 py-3">{aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</td>
                      <td className="px-4 py-3">
                        {aluno.enrollments && aluno.enrollments.length > 0 
                          ? aluno.enrollments.map((e: any) => e.courses?.title).join(", ") 
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-3">{new Date(aluno.created_at).toLocaleDateString('pt-BR')}</td>
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
