"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createExam } from "@/app/actions/exams"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b] font-bold"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Criando...
        </>
      ) : (
        "Criar Prova"
      )}
    </Button>
  )
}

interface Subject {
  id: number
  title: string
  course_id: number
  courses?: { title: string } | null
}

export function CreateExamForm({ subjects }: { subjects: any[] }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    
    try {
      const result = await createExam(formData)
      
      if (result.success) {
        setSuccess(true)
        const form = document.getElementById("create-exam-form") as HTMLFormElement
        form?.reset()
        
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(result.error || "Ocorreu um erro ao criar a prova.")
      }
    } catch (err: any) {
      setError("Erro de rede ou inesperado. Tente novamente.")
    }
  }

  return (
    <form id="create-exam-form" action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Prova criada com sucesso!</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título da Prova</Label>
        <Input id="title" name="title" required placeholder="Ex: Avaliação 01" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject_id">Matéria</Label>
        <select 
          id="subject_id" 
          name="subject_id" 
          required 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all disabled:opacity-50"
        >
          <option value="">Selecione...</option>
          {subjects?.map(s => (
            <option key={s.id} value={s.id}>
              {s.courses?.title ? `${s.courses.title} - ` : ""}{s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time_limit_minutes">Tempo Limite (minutos)</Label>
        <Input id="time_limit_minutes" name="time_limit_minutes" type="number" defaultValue={60} required />
      </div>

      <SubmitButton />
    </form>
  )
}
