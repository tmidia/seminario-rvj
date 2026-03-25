"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CpfInput } from "@/components/CpfInput"
import { Label } from "@/components/ui/label"
import { createStudent } from "@/app/actions/students"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function StudentForm({ courses }: { courses: { id: number, title: string }[] }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setLoading(true)
    try {
      await createStudent(formData)
      const form = document.getElementById("student-form") as HTMLFormElement
      if (form) form.reset()
      router.refresh()
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="student-form" action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-md flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome Completo</Label>
        <Input id="full_name" name="full_name" required disabled={loading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <CpfInput id="cpf" name="cpf" required minLength={14} placeholder="000.000.000-00" disabled={loading} />
      </div>
      <div className="space-y-3">
        <Label>Cursos Matriculados</Label>
        <div className="flex flex-col gap-2 p-3 border rounded-md bg-slate-50">
          {courses?.map(c => (
             <label key={c.id} className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox" 
                 name="course_ids" 
                 value={c.id} 
                 disabled={loading}
                 className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
               />
               <span className="text-sm font-medium text-slate-700">{c.title}</span>
             </label>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b]">
        {loading ? "Salvando..." : "Cadastrar / Atualizar Aluno"}
      </Button>
    </form>
  )
}
