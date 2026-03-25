"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { submitExamAttempt } from "@/app/actions/engine"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ExamEngine({ attempt, exam, questions }: { attempt: Record<string, any>, exam: Record<string, any>, questions: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [answers, setAnswers] = useState<Record<string, string>>(attempt.answers || {})
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const start = new Date(attempt.created_at || attempt.started_at).getTime()
    const now = new Date().getTime()
    const diffSeconds = Math.floor((now - start) / 1000)
    const limitSeconds = exam.time_limit_minutes * 60
    return Math.max(0, limitSeconds - diffSeconds)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([])

  useEffect(() => {
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5))
  }, [questions])

  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitting) {
      handleFinalSubmit()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 && !isSubmitting) {
           clearInterval(timer)
           handleFinalSubmit()
           return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isSubmitting])

  const handleSelect = (questionId: string, option: string) => {
    const newAnswers = { ...answers, [questionId]: option }
    setAnswers(newAnswers)
    
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    setSaving(true)
    saveTimeout.current = setTimeout(async () => {
      await supabase.from('exam_attempts').update({ answers: newAnswers }).eq('id', attempt.id)
      setSaving(false)
    }, 1500)
  }

  const allAnswered = questions.every(q => answers[q.id.toString()])

  async function handleFinalSubmit() {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      await supabase.from('exam_attempts').update({ answers }).eq('id', attempt.id)
      await submitExamAttempt(attempt.id, exam.id)
      router.push(`/aluno/resultado/${attempt.id}`)
    } catch (e) {
      console.error(e)
      alert("Erro ao finalizar prova. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (shuffledQuestions.length === 0) return null

  return (
    <>
      <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur shadow-sm border-b py-3 px-4 mb-6 rounded-b-xl flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xl font-bold text-[#0a3a2a]">
          <Clock className={timeLeft < 300 ? "text-red-500 animate-pulse" : "text-[#c29a4b]"} />
          <span className={timeLeft < 300 ? "text-red-500" : ""}>{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1">
             {saving ? <span className="animate-pulse flex items-center gap-1"><Save size={14}/> Salvando...</span> : <span className="flex items-center gap-1"><CheckCircle2 size={14}/> Salvo</span>}
          </div>
          <Button 
            onClick={handleFinalSubmit} 
            disabled={!allAnswered || isSubmitting}
            className={`${allAnswered ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-200 text-slate-500'} font-bold transition-all`}
          >
            {isSubmitting ? 'Enviando...' : 'Finalizar Prova'}
          </Button>
        </div>
      </div>

      {!allAnswered && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">Você precisa responder todas as <strong>{questions.length}</strong> questões para poder enviar a prova.</p>
        </div>
      )}

      <div className="space-y-8">
        {shuffledQuestions.map((q, index) => (
          <Card key={q.id} className="overflow-hidden border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="bg-slate-50 border-b p-4">
                <span className="font-bold text-[#c29a4b] text-sm">Questão {index + 1}</span>
                <div className="font-medium mt-2 text-slate-800 text-lg" dangerouslySetInnerHTML={{ __html: q.text }}></div>
              </div>
              <div className="p-4 space-y-2">
                {Object.entries(q.options).map(([key, value]) => {
                   const isSelected = answers[q.id.toString()] === key
                   return (
                     <label key={key} className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-blue-400 shadow-sm ring-1 ring-blue-300' : 'bg-white hover:bg-slate-50 border-slate-200'}`}>
                       <input 
                         type="radio" 
                         name={`q_${q.id}`} 
                         value={key} 
                         checked={isSelected}
                         onChange={() => handleSelect(q.id.toString(), key)}
                         className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                       />
                       <span className={`text-sm ${isSelected ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>
                         <strong className="mr-2 text-blue-900/50">{key})</strong> {value as string}
                       </span>
                     </label>
                   )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button 
          size="lg"
          onClick={handleFinalSubmit} 
          disabled={!allAnswered || isSubmitting}
          className={`${allAnswered ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' : 'bg-slate-200 text-slate-500'} font-bold px-8`}
        >
          {isSubmitting ? 'Processando Grade...' : 'Entregar Respostas'}
        </Button>
      </div>
    </>
  )
}
