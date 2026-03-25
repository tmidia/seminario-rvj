import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, FileText, CheckCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

export default async function AdminDashboard() {
  const supabase = createClient()
  
  const { count: totalAlunos } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'aluno')
  const { count: totalProvas } = await supabase.from('exams').select('*', { count: 'exact', head: true })
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlunos || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Provas Cadastradas</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProvas || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Online</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
