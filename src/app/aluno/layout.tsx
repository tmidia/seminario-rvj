import { ReactNode } from "react"
import Link from "next/link"
import { History, LayoutDashboard, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

export default async function AlunoLayout({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0a3a2a] text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-[#c29a4b] text-xl hidden sm:block">Seminário RVJ</h1>
            <h1 className="font-serif font-bold text-[#c29a4b] text-xl sm:hidden">RVJ</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/aluno/dashboard" className="flex items-center gap-2 hover:text-[#c29a4b] transition-colors"><LayoutDashboard size={16}/> Minhas Matérias</Link>
            <Link href="/aluno/historico" className="flex items-center gap-2 hover:text-[#c29a4b] transition-colors"><History size={16}/> Meu Histórico</Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-white">{profile?.full_name}</p>
              <p className="text-xs text-white/70">Aluno</p>
            </div>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors" title="Sair">
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50 pb-safe">
        <Link href="/aluno/dashboard" className="flex flex-col items-center gap-1 text-xs text-slate-600">
          <LayoutDashboard size={20} />
          Matérias
        </Link>
        <Link href="/aluno/historico" className="flex flex-col items-center gap-1 text-xs text-slate-600">
          <History size={20} />
          Histórico
        </Link>
      </div>
    </div>
  )
}
