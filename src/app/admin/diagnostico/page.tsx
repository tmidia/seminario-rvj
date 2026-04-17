import { createAdminClient } from "@/utils/supabase/admin"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function DiagnosticoPage() {
  const cpfToSearch = '21689666803'
  let result = null
  let error = null
  let authUser = null

  try {
    const adminSupabase = createAdminClient()
    
    // 1. Search in profiles
    const { data, error: dbError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('cpf', cpfToSearch)
      .maybeSingle()

    if (dbError) {
      error = dbError.message
    } else {
      result = data
      
      if (data) {
        // 2. Check in Auth
        const { data: authData } = await adminSupabase.auth.admin.getUserById(data.id)
        authUser = authData?.user
      }
    }
  } catch (e: any) {
    error = e.message
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Diagnóstico de Aluno: {cpfToSearch}</h1>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <strong>Erro na consulta:</strong> {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados no Banco (Tabela profiles)</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <pre className="bg-slate-50 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <p className="text-amber-600 font-bold">ALUNO NÃO ENCONTRADO para o CPF {cpfToSearch}.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados de Autenticação (Auth)</CardTitle>
          </CardHeader>
          <CardContent>
            {authUser ? (
              <pre className="bg-slate-50 p-4 rounded text-xs overflow-auto">
                {JSON.stringify({
                  id: authUser.id,
                  email: authUser.email,
                  last_sign_in: authUser.last_sign_in_at,
                  confirmed: !!authUser.email_confirmed_at
                }, null, 2)}
              </pre>
            ) : (
              <p className="text-slate-500 italic">Sem dados de autenticação vinculados.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-bold mb-2">Orientações:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Se o aluno não for encontrado acima, ele realmente não está cadastrado com este CPF.</li>
          <li>Verifique se há outros CPFs similares no banco de dados.</li>
        </ul>
      </div>
    </div>
  )
}
