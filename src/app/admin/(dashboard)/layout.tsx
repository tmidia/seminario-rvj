import { ReactNode } from "react"
import Link from "next/link"
import { BookOpen, Users, LayoutDashboard, LogOut, Award } from "lucide-react"

import { MobileNav } from "./MobileNav"

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#e8eee9]"> {/* Alterado para um cinza esverdeado super leve (desenjoativo) */}
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-[#0a3a2a] text-white p-4 shadow-md z-20 sticky top-0">
        <div>
          <h2 className="text-xl font-serif text-[#c29a4b] font-bold">Seminário RVJ</h2>
          <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold mt-0.5">Admin</p>
        </div>
        <MobileNav />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0a3a2a] text-white flex-col shadow-2xl z-10 shrink-0 sticky top-0 h-screen border-r border-[#c29a4b]/20">
        <div className="p-6 text-center border-b border-white/10 bg-[#083024]">
          <h2 className="text-2xl font-serif text-[#c29a4b] font-bold tracking-wide">Seminário RVJ</h2>
          <p className="text-xs text-[#c29a4b]/80 mt-1.5 uppercase font-bold tracking-widest">Painel Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <LayoutDashboard size={20} className="text-[#c29a4b]" />
            <span className="font-medium text-slate-100">Dashboard</span>
          </Link>
          <Link href="/admin/alunos" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <Users size={20} className="text-[#c29a4b]" />
            <span className="font-medium text-slate-100">Alunos</span>
          </Link>
          <Link href="/admin/materias" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <BookOpen size={20} className="text-[#c29a4b]" />
            <span className="font-medium text-slate-100">Matérias</span>
          </Link>
          <Link href="/admin/provas" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <BookOpen size={20} className="text-[#c29a4b]" />
            <span className="font-medium text-slate-100">Provas</span>
          </Link>
          <Link href="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <Users size={20} className="text-[#c29a4b]" />
            <span className="font-medium text-slate-100">Professores</span>
          </Link>
          <Link href="/admin/certificado" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <Award size={20} className="text-[#c29a4b]" />
            <span className="font-medium text-slate-100">Certificados</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 bg-[#072a1e]">
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-red-400 hover:bg-red-500/20 transition-colors font-medium">
              <LogOut size={20} />
              <span>Sair do Sistema</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto w-full">
        {children}
      </main>
    </div>
  )
}
