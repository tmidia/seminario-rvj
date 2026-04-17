import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react"

export default async function ResultadoPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  
  const { data: attempt } = await adminSupabase
    .from('exam_attempts')
    .select('*, exams(title, subjects(title))')
    .eq('id', params.id)
    .single()


  if (!attempt || attempt.status !== 'completed') {
    return <div className="p-8 text-center text-red-500">Resultado não disponível.</div>
  }

  const score = parseFloat(attempt.score)
  const isApproved = score >= 7.0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/aluno/dashboard"><ArrowLeft size={18} /></Link>
        </Button>
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Resultado da Avaliação</h1>
      </div>

      <Card className="text-center overflow-hidden border-0 shadow-lg">
        <div className={`h-3 w-full ${isApproved ? 'bg-green-500' : 'bg-red-500'}`} />
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{attempt.exams?.subjects?.title}</CardTitle>
          <p className="text-slate-500">{attempt.exams?.title}</p>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex justify-center mb-6">
            {isApproved ? (
              <CheckCircle2 size={80} className="text-green-500" />
            ) : (
              <XCircle size={80} className="text-red-500" />
            )}
          </div>
          
          <h2 className={`text-4xl font-bold mb-2 ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
            Nota: {score.toFixed(1)}
          </h2>
          
          <p className="text-lg text-slate-700 font-medium">
            {isApproved 
              ? "Parabéns, você foi aprovado(a) e o próximo módulo foi liberado!" 
              : "Infelizmente você não atingiu a média 7.0 para aprovação."}
          </p>
          
          {!isApproved && (
            <p className="mt-4 text-sm text-slate-500 bg-slate-50 p-4 rounded-md inline-block border">
              Revise o material de estudo e tente novamente quando estiver pronto(a). <br/>
              O sistema permite refazer a avaliação sem restrições.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center bg-slate-50 py-6 border-t">
          <Button asChild size="lg" className="bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 min-w-[200px] text-[#c29a4b]">
            <Link href="/aluno/dashboard">Voltar para a Central</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
