import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShieldAlert, Trash2 } from "lucide-react"
import { StaffForm } from "./ClientForm"
import { deleteStaff } from "@/app/actions/staff"
import { Button } from "@/components/ui/button"

export default async function UsuariosPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (adminProfile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-600">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Acesso Restrito</h2>
        <p>Apenas administradores podem gerenciar professores e sub-diretores.</p>
      </div>
    )
  }

  // Fetch all staff users (role != aluno)
  const { data: staff } = await supabase
    .from('profiles')
    .select('*')
    .neq('role', 'aluno')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Gestão de Servidores</h1>
        <StaffForm />
      </div>

      <Card className="border-t-4 border-t-[#0a3a2a] shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-[#0a3a2a]">
            <Users size={24} className="text-[#c29a4b]"/> Servidores / Professores Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 font-medium">
                <tr>
                  <th className="p-4">Nome do Servidor</th>
                  <th className="p-4">Nível de Acesso</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {staff?.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">{member.full_name}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs uppercase font-bold tracking-widest rounded-full ${member.role === 'admin' ? 'bg-[#c29a4b]/20 text-[#8e6b26]' : 'bg-slate-200 text-slate-600'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 text-center text-emerald-600 text-xs font-bold uppercase tracking-wider">
                      Ativo
                    </td>
                    <td className="p-4 text-right">
                      {member.id !== user.id && (
                        <form action={deleteStaff.bind(null, member.id)}>
                          <Button variant="destructive" size="sm" className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                            <Trash2 size={16} />
                          </Button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {!staff?.length && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Nenhum servidor encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
