"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X, LayoutDashboard, Users, BookOpen, LogOut } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 rounded-md hover:bg-white/10 transition-colors">
        <Menu size={24} className="text-[#c29a4b]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-[#0a3a2a]/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          
          {/* Slide-in Menu */}
          <div className="relative w-64 bg-[#0a3a2a] text-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left-4 duration-300">
            <div className="p-4 flex justify-between items-center border-b border-white/10">
              <h2 className="font-serif text-[#c29a4b] font-bold text-lg tracking-wide">Menu</h2>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-white/10 text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <Link onClick={() => setOpen(false)} href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
                <LayoutDashboard size={20} className="text-[#c29a4b]" /> <span className="font-medium text-slate-100">Dashboard</span>
              </Link>
              <Link onClick={() => setOpen(false)} href="/admin/alunos" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
                <Users size={20} className="text-[#c29a4b]" /> <span className="font-medium text-slate-100">Alunos</span>
              </Link>
              <Link onClick={() => setOpen(false)} href="/admin/materias" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
                <BookOpen size={20} className="text-[#c29a4b]" /> <span className="font-medium text-slate-100">Matérias</span>
              </Link>
              <Link onClick={() => setOpen(false)} href="/admin/provas" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
                <BookOpen size={20} className="text-[#c29a4b]" /> <span className="font-medium text-slate-100">Provas</span>
              </Link>
              <Link onClick={() => setOpen(false)} href="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
                <Users size={20} className="text-[#c29a4b]" /> <span className="font-medium text-slate-100">Professores</span>
              </Link>
            </nav>

            <div className="p-4 border-t border-white/10 bg-[#072a1e]">
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-red-400 hover:bg-red-500/20 transition-colors font-medium">
                  <LogOut size={20} /> <span>Sair do Sistema</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
