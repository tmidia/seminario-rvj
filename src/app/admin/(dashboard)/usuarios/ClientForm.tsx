"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createStaff } from "@/app/actions/staff"
import { Plus, AlertCircle, ShieldCheck } from "lucide-react"

export function StaffForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState("professor")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("role", role)

    try {
      await createStaff(formData)
      setOpen(false)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Ocorreu um erro desconhecido.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#c29a4b] hover:bg-[#a6823c] text-[#0a3a2a] font-bold shadow-md hover:shadow-lg transition-all flex gap-2">
          <Plus size={18} /> Novo Servidor / Professor
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px] border-t-4 border-t-[#0a3a2a]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center text-[#0a3a2a] font-serif text-2xl">
            <ShieldCheck className="text-[#c29a4b]" /> Cadastrar Servidor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name" className="text-slate-600 font-semibold">Nome Completo</Label>
              <Input id="full_name" name="full_name" required className="mt-1" placeholder="Ex: Rev. João Silva" />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-600 font-semibold">E-mail Institucional</Label>
              <Input id="email" name="email" type="email" required className="mt-1" placeholder="joao@rvj.com.br" />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-600 font-semibold">Senha de Acesso</Label>
              <Input id="password" name="password" type="password" required className="mt-1" placeholder="••••••••" minLength={6} />
              <p className="text-[10px] text-slate-400 mt-1 uppercase">Mínimo 6 caracteres.</p>
            </div>

            <div>
              <Label htmlFor="role" className="text-slate-600 font-semibold mb-2 block">Nível de Permissão</Label>
              <select 
                id="role"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="professor">Professor (Visualização e Notas)</option>
                <option value="admin">Administrador (Acesso Total)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3 w-full">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full text-slate-500 hover:bg-slate-100 border-slate-200">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="w-full bg-[#0a3a2a] hover:bg-[#0d4a36] text-white">
              {loading ? "Registrando..." : "Cadastrar Servidor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
