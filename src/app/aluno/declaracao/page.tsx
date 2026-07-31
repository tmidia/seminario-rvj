import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { singleRelation } from "@/utils/relation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, GraduationCap, Info } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

type Course = {
  id: number
  title: string
}

export const dynamic = "force-dynamic"

export default async function DeclarationPage() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/")

  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("id, role, status")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "aluno" || profile.status === "inativo") {
    redirect("/aluno/dashboard")
  }

  const { data: enrollments } = await adminSupabase
    .from("enrollments")
    .select("course_id, courses(id, title)")
    .eq("profile_id", user.id)

  const courses = (enrollments ?? []).flatMap((enrollment) => {
    const course = singleRelation<Course>(enrollment.courses)
    return course ? [course] : []
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Declaração de Matrícula</h1>
        <p className="text-slate-500 mt-2">Emita uma declaração para um dos seus cursos com matrícula ativa.</p>
      </div>

      <Card className="border-amber-200 bg-amber-50/60">
        <CardContent className="p-4 flex gap-3 text-sm text-amber-900">
          <Info size={20} className="shrink-0 mt-0.5 text-[#c29a4b]" />
          <p>A declaração informa sua situação de matrícula na data de emissão. Ela não substitui o certificado de conclusão.</p>
        </CardContent>
      </Card>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            Não foi encontrada uma matrícula ativa vinculada ao seu perfil. Entre em contato com a secretaria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id} className="border-t-4 border-t-[#c29a4b] shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-[#0a3a2a]">{course.title}</CardTitle>
                    <CardDescription className="mt-2">Matrícula ativa</CardDescription>
                  </div>
                  <GraduationCap className="text-[#c29a4b] shrink-0" size={30} />
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b]">
                  <Link href={`/aluno/declaracao/${course.id}`}>
                    <FileText size={18} className="mr-2" /> Gerar declaração
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
