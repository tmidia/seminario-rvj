import { ReactNode } from "react"
import Link from "next/link"
import { BookOpen, Users, LayoutDashboard, LogOut } from "lucide-react"

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-[#0a3a2a] text-white flex flex-col shadow-lg z-10">
        <div className="p-6 text-center border-b border-white/10">
          <h2 className="text-xl font-serif text-[#c29a4b]">Seminário RVJ</h2>
          <p className="text-xs text-slate-300 mt-1">Painel Administrativo</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/alunos" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <Users size={20} />
            <span>Alunos</span>
          </Link>
          <Link href="/admin/materias" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <BookOpen size={20} />
            <span>Matérias</span>
          </Link>
          <Link href="/admin/provas" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <BookOpen size={20} />
            <span>Provas</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-red-300 hover:bg-white/10 transition-colors">
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
