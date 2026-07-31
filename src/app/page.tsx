import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { isValidCPF } from "@/utils/cpf"
import { Button } from "@/components/ui/button"
import { CpfInput } from "@/components/CpfInput"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { MessageCircle, Shield } from "lucide-react"

import { createAdminClient } from "@/utils/supabase/admin"

const SUPPORT_WHATSAPP = "5568996030707"
const SUPPORT_MESSAGE = "Olá! Preciso de ajuda para acessar a plataforma do Seminário Teológico RVJ."
const SUPPORT_URL = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(SUPPORT_MESSAGE)}`

// Mensagens em linguagem simples. O erro cru do Supabase ("Invalid login
// credentials") nunca chega ao aluno; ele fica apenas no log do servidor.
const LOGIN_ERRORS: Record<string, { message: string; showSupport: boolean }> = {
  cpf_invalido: {
    message: "Este CPF não é válido. Confira os números digitados e tente novamente.",
    showSupport: false,
  },
  nao_cadastrado: {
    message:
      "Não encontramos este CPF na plataforma. Confira se digitou corretamente. Se estiver certo, fale com o suporte para verificar sua matrícula.",
    showSupport: true,
  },
  matricula_inativa: {
    message: "Sua matrícula está inativa no momento. Fale com o suporte para regularizar seu acesso.",
    showSupport: true,
  },
  falha_login: {
    message: "Não conseguimos entrar na sua conta agora. Tente novamente em alguns instantes ou fale com o suporte.",
    showSupport: true,
  },
}

async function loginStudent(data: FormData) {
  "use server"
  const supabase = createClient()
  const rawCpf = data.get("cpf") as string


  const cpf = rawCpf.replace(/\D/g, "")

  if (!isValidCPF(cpf)) {
    redirect("/?error=cpf_invalido")
  }

  // 1. Tenta buscar o e-mail real se a chave administrativa estiver disponível
  let email = `${cpf}.rvj@gmail.com`
  let situacao: "encontrado" | "nao_cadastrado" | "inativo" | "indefinido" = "indefinido"

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const adminSupabase = createAdminClient()
      const { data: profile, error } = await adminSupabase
        .from("profiles")
        .select("status, email")
        .eq("cpf", cpf)
        .maybeSingle()

      if (error) {
        console.error("Erro ao consultar perfil no login:", error)
      } else if (!profile) {
        situacao = "nao_cadastrado"
      } else if (profile.status === "inativo") {
        situacao = "inativo"
      } else {
        situacao = "encontrado"
        if (profile.email) {
          email = profile.email
        }
      }
    } catch (err) {
      console.error("Erro ao usar admin client no login:", err)
      // Mantém o email padrão em caso de erro na chave ou consulta
    }
  }

  // Os redirects ficam fora do try: redirect() funciona lançando uma exceção,
  // e o catch acima a engoliria silenciosamente.
  if (situacao === "nao_cadastrado") {
    redirect("/?error=nao_cadastrado")
  }
  if (situacao === "inativo") {
    redirect("/?error=matricula_inativa")
  }

  // 2. Sign in with the calculated or fetched email
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: `Rvj@${cpf}`,
  })

  if (signInError) {
    console.error("Falha no login do aluno:", signInError.message, signInError.status)
    // Sem a chave administrativa não dá para distinguir CPF inexistente de
    // senha divergente, então tratamos como cadastro não localizado.
    redirect(situacao === "encontrado" ? "/?error=falha_login" : "/?error=nao_cadastrado")
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

  // Códigos conhecidos viram texto amigável; qualquer outro valor (links antigos)
  // continua sendo exibido como veio, para não sumir com a mensagem.
  const erro = searchParams.error
    ? LOGIN_ERRORS[searchParams.error] ?? { message: searchParams.error, showSupport: true }
    : null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a3a2a] p-4">
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
            {erro && (
              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 text-center space-y-3">
                <p className="font-medium">{erro.message}</p>
                {erro.showSupport && (
                  <a
                    href={SUPPORT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-11 rounded-md bg-[#25D366] text-white font-bold hover:bg-[#1eb955] transition-colors"
                  >
                    <MessageCircle size={18} /> Falar com o suporte
                  </a>
                )}
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
      
      <div className="mt-8 flex flex-col items-center gap-3 text-white/50 text-sm">
        <span>Acesso restrito para alunos matriculados.</span>
        <a
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
        >
          <MessageCircle size={14} /> Precisa de ajuda? Fale com o suporte
        </a>
        <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1 opacity-70 hover:opacity-100">
          <Shield size={14} /> Área do Professor
        </Link>
      </div>
    </div>
  )
}
