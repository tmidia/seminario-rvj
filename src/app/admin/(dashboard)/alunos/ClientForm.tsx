"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CpfInput } from "@/components/CpfInput"
import { Label } from "@/components/ui/label"
import { createStudent, updateStudent, updateStudentStatus, approveStudentForCertificates } from "@/app/actions/students"
import { AlertCircle, UserPlus, Edit2, Power, Award, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { isValidCPF } from "@/utils/cpf"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Course = { id: number, title: string }
type Student = { id: string, full_name: string, cpf: string, status: string, enrollments: { courses: { id: number, title: string } }[] }

export function NewStudentDialog({ courses }: { courses: Course[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const cpfValue = formData.get("cpf") as string
    if (!isValidCPF(cpfValue.replace(/\D/g, ''))) {
      setError("O CPF digitado não é válido.")
      setLoading(false)
      return
    }

    try {
      const res = await createStudent(formData)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
        return
      }
      setOpen(false)
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#c29a4b] hover:bg-[#a6823c] text-[#0a3a2a] font-bold shadow-md flex gap-2">
          <UserPlus size={18} /> Novo Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-t-4 border-t-[#0a3a2a]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#0a3a2a]">Cadastrar Aluno</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input id="full_name" name="full_name" required disabled={loading} placeholder="Ex: João da Silva" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <CpfInput id="cpf" name="cpf" required minLength={14} placeholder="000.000.000-00" disabled={loading} />
          </div>
          <div className="space-y-3">
            <Label>Cursos Matriculados</Label>
            <div className="flex flex-col gap-2 p-3 border rounded-md bg-slate-50 max-h-48 overflow-y-auto">
              {courses?.map(c => (
                 <label key={c.id} className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" name="course_ids" value={c.id} disabled={loading} className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                   <span className="text-sm font-medium text-slate-700">{c.title}</span>
                 </label>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-white">
            {loading ? "Salvando..." : "Cadastrar Aluno"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function EditStudentDialog({ student, courses }: { student: Student, courses: Course[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const studentCourses = student.enrollments?.map(e => e.courses?.id) || []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await updateStudent(student.id, formData)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
        return
      }
      setOpen(false)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Edit2 size={14} className="mr-1" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-t-4 border-t-[#0a3a2a]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#0a3a2a]">Editar Aluno</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input id="full_name" name="full_name" defaultValue={student.full_name} required disabled={loading} />
          </div>
          <div className="space-y-2">
             <Label htmlFor="email">E-mail (Opcional - preencha para alterar o login)</Label>
             <Input id="email" name="email" type="email" placeholder="Deixe em branco para manter" disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <CpfInput id="cpf" name="cpf" defaultValue={student.cpf} required minLength={14} disabled={loading} />
          </div>
          <div className="space-y-3">
            <Label>Cursos Matriculados</Label>
            <div className="flex flex-col gap-2 p-3 border rounded-md bg-slate-50 max-h-48 overflow-y-auto">
              {courses?.map(c => (
                 <label key={c.id} className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" name="course_ids" value={c.id} defaultChecked={studentCourses.includes(c.id)} disabled={loading} className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                   <span className="text-sm font-medium text-slate-700">{c.title}</span>
                 </label>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-white">
            {loading ? "Salvando..." : "Atualizar Aluno"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ToggleStudentStatusButton({ student }: { student: Student }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isActive = student.status !== 'inativo'

  const handleToggle = async () => {
    if (!confirm(`Deseja realmente ${isActive ? 'desativar' : 'ativar'} o aluno ${student.full_name}?`)) return
    setLoading(true)
    try {
      await updateStudentStatus(student.id, student.status || 'ativo')
      router.refresh()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro desconhecido")
      setLoading(false)
    }
  }

  return (
    <Button 
      variant={isActive ? "outline" : "default"} 
      size="sm" 
      onClick={handleToggle} 
      disabled={loading}
      className={`h-8 ${isActive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
    >
      <Power size={14} className="mr-1" /> {isActive ? 'Desativar' : 'Ativar'}
    </Button>
  )
}

export function ApproveStudentButton({ student }: { student: Student }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null) // 'full' or 'partial'
  const [score, setScore] = useState("10.0")

  const handleApprove = async (mode: 'full' | 'partial') => {
    const confirmMsg = mode === 'full' 
      ? `Tem certeza que deseja APROVAR este aluno em TODAS as matérias? Esta ação lançará notas máximas em tudo.`
      : `Deseja aprovar apenas as provas que o aluno JÁ REALIZOU? As provas não iniciadas continuarão pendentes.`
    
    if (!confirm(confirmMsg)) return
    
    setLoading(mode)
    try {
      const res = await approveStudentForCertificates(student.id, mode === 'partial', parseFloat(score) || 10.0)
      if (res?.error) {
        alert(res.error)
        return
      }
      alert("Sucesso! O aluno foi atualizado.")
      setOpen(false)
      router.refresh()
    } catch {
      alert("Erro desconhecido de rede.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm" 
          disabled={student.status === 'inativo'}
          className="h-8 text-[#c29a4b] hover:text-[#a6823c] hover:bg-[#fdfbf6] border-[#c29a4b]/30"
          title="Opções de Aprovação"
        >
          <Award size={14} className="mr-1" /> Aprovar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-t-4 border-t-[#c29a4b]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#0a3a2a]">Opções de Aprovação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-slate-600 text-sm">
            Defina a nota e escolha o tipo de aprovação para <strong>{student.full_name}</strong>:
          </p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <Label htmlFor="grade" className="text-[#0a3a2a] font-bold">Nota para Aprovação</Label>
            <div className="flex items-center gap-3">
              <Input 
                id="grade"
                type="number" 
                step="0.1" 
                min="0" 
                max="10" 
                value={score} 
                onChange={(e) => setScore(e.target.value)}
                className="w-24 text-center font-bold text-lg"
              />
              <span className="text-xs text-slate-500">
                Esta nota será atribuída a todas as provas aprovadas nesta ação.
              </span>
            </div>
          </div>

          <div className="grid gap-3">
            <button 
              onClick={() => handleApprove('full')}
              disabled={!!loading}
              className="group relative w-full p-4 text-left border rounded-lg hover:border-[#c29a4b] hover:bg-[#fdfbf6] transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-[#fdfbf6] rounded-full text-[#c29a4b] group-hover:bg-[#c29a4b] group-hover:text-white transition-colors">
                  <Award size={20} />
                </div>
                <div className="font-bold text-[#0a3a2a]">Aprovação Total (Tudo)</div>
              </div>
              <p className="text-xs text-slate-500 ml-11">
                Lança nota {score} em TODAS as matérias dos cursos vinculados. Ideal para liberar o certificado imediatamente.
              </p>
              {loading === 'full' && <div className="absolute top-4 right-4 animate-spin h-4 w-4 border-2 border-[#c29a4b] border-t-transparent rounded-full" />}
            </button>

            <button 
              onClick={() => handleApprove('partial')}
              disabled={!!loading}
              className="group relative w-full p-4 text-left border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CheckCircle2 size={20} />
                </div>
                <div className="font-bold text-[#0a3a2a]">Aprovar Apenas Realizadas</div>
              </div>
              <p className="text-xs text-slate-500 ml-11">
                Lança nota {score} APENAS nas provas que o aluno já iniciou ou tentou fazer. Útil para alunos do sistema antigo.
              </p>
              {loading === 'partial' && <div className="absolute top-4 right-4 animate-spin h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full" />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
