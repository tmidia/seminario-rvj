import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CpfInput } from "@/components/CpfInput"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Shield } from "lucide-react"

async function loginStudent(data: FormData) {
  "use server"
  const supabase = createClient()
  const rawCpf = data.get("cpf") as string
  const cpf = rawCpf.replace(/\D/g, "")
  
  if (cpf.length !== 11) {
    redirect("/?error=CPF Inválido")
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: `${cpf}.rvj@gmail.com`,
    password: `Rvj@${cpf}`,
  })

  // We are not testing the admin login fallback here because it's distinct
  if (signInError) {
    redirect("/?error=CPF não encontrado ou não matriculado")
  }

  redirect("/aluno/dashboard")
}

export default async function StudentLogin({ searchParams }: { searchParams: { error?: string } }) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  if (data?.user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile?.role === 'admin') redirect('/admin')
    else redirect("/aluno/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a3a2a]">
      <div className="mb-8 text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#c29a4b]">Seminário Teológico RVJ</h1>
        <p className="text-base md:text-xl opacity-80 mt-2">Plataforma de Avaliações Online</p>
      </div>

      <Card className="w-full max-w-sm">
        <form action={loginStudent}>
          <CardHeader>
            <CardTitle className="text-xl text-center">Acesso do Aluno</CardTitle>
            <CardDescription className="text-center">Digite seu CPF para entrar (somente números)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams.error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 text-center font-medium">
                {searchParams.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="cpf">Seu CPF</Label>
              <CpfInput id="cpf" name="cpf" required minLength={14} placeholder="000.000.000-00" className="text-center text-2xl tracking-widest h-14" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#c29a4b] hover:bg-[#c29a4b]/80 text-[#0a3a2a] font-bold text-lg h-12">
              Acessar Central
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-8 flex flex-col items-center gap-2 text-white/50 text-sm">
        <span>Acesso restrito para alunos matriculados.</span>
        <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1 opacity-70 hover:opacity-100">
          <Shield size={14} /> Área do Professor
        </Link>
      </div>
    </div>
  )
}
