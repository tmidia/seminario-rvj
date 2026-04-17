import { createAdminClient } from "@/utils/supabase/admin"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { NewStudentDialog, EditStudentDialog, ToggleStudentStatusButton, ApproveStudentButton } from "./ClientForm"
import Link from "next/link"

export type StudentData = {
  id: string
  full_name: string
  cpf: string
  status: string
  created_at: string
  enrollments: {
    courses: {
      id: number
      title: string
    }
  }[]
}

export const dynamic = "force-dynamic"

export default async function AlunosPage() {
  const supabase = createAdminClient()
  
  // Fetch profiles and courses in parallel
  const [
    { data: rawAlunos, error: alunosError },
    { data: courses }
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, enrollments(courses(id,title))")
      .eq("role", "aluno")
      .order("created_at", { ascending: false }),
    supabase.from("courses").select("*")
  ])

  const alunos = rawAlunos as unknown as StudentData[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Alunos</h1>
        <NewStudentDialog courses={courses || []} />
      </div>

      <Card className="shadow-lg bg-white/50 backdrop-blur-sm border-t-4 border-t-[#0a3a2a]">
        <CardHeader>
          <CardTitle className="text-xl text-[#0a3a2a]">Alunos Matriculados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">CPF</th>
                  <th className="px-4 py-3 font-medium">Curso(s)</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium">Data de Cadastro</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(!alunos || alunos.length === 0) && (
                  <tr><td colSpan={6} className="px-4 py-4 text-center text-slate-500">
                    {alunosError ? `Erro BD: ${alunosError.message}` : 'Nenhum aluno cadastrado.'}
                  </td></tr>
                )}
                {alunos?.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{aluno.full_name}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {aluno.enrollments && aluno.enrollments.length > 0 
                        ? aluno.enrollments.map((e) => e.courses?.title).join(", ") 
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${aluno.status === 'inativo' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {aluno.status || 'ativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(aluno.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/alunos/${aluno.id}`} className="inline-flex items-center justify-center p-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors" title="Ver Histórico">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                        </Link>
                        <ApproveStudentButton student={aluno} />
                        <EditStudentDialog student={aluno} courses={courses || []} />
                        <ToggleStudentStatusButton student={aluno} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
