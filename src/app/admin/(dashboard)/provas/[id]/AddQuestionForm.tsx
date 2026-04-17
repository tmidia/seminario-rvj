"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addQuestion } from "@/app/actions/exams"
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
          Adicionando...
        </>
      ) : (
        "Adicionar Questão"
      )}
    </Button>
  )
}

export function AddQuestionForm({ examId }: { examId: number }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    
    try {
      const result = await addQuestion(formData)
      
      if (result.success) {
        setSuccess(true)
        const form = document.getElementById("add-question-form") as HTMLFormElement
        form?.reset()
        
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(result.error || "Ocorreu um erro ao adicionar a questão.")
      }
    } catch (err: unknown) {
      console.error("handleSubmit: Erro inesperado:", err)
      setError("Erro de rede ou inesperado. Tente novamente.")
    }
  }

  return (
    <form id="add-question-form" action={handleSubmit} className="space-y-4">
      <input type="hidden" name="exam_id" value={examId} />
      
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Questão adicionada com sucesso!</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="text">Enunciado</Label>
        <textarea 
          id="text" 
          name="text" 
          required 
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Alternativa A</Label>
          <Input name="optA" required />
        </div>
        <div className="space-y-2">
          <Label>Alternativa B</Label>
          <Input name="optB" required />
        </div>
        <div className="space-y-2">
          <Label>Alternativa C</Label>
          <Input name="optC" required />
        </div>
        <div className="space-y-2">
          <Label>Alternativa D</Label>
          <Input name="optD" required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="correct_option">Alternativa Correta</Label>
        <select 
          id="correct_option" 
          name="correct_option" 
          required 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all disabled:opacity-50"
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <SubmitButton />
    </form>
  )
}
