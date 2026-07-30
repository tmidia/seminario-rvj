import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import { DeclarationClient } from "./DeclarationClient"

type Course = {
  id: number
  title: string
}

export const dynamic = "force-dynamic"

export default async function DeclarationDocumentPage({ params }: { params: { courseId: string } }) {
  const courseId = Number.parseInt(params.courseId, 10)
  if (!Number.isInteger(courseId) || courseId < 1) redirect("/aluno/declaracao")

  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("full_name, cpf, role, status")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "aluno" || profile.status === "inativo") {
    redirect("/aluno/declaracao")
  }

  const { data: enrollment } = await adminSupabase
    .from("enrollments")
    .select("course_id, courses(id, title)")
    .eq("profile_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle()

  const course = enrollment?.courses as Course | null
  if (!course) redirect("/aluno/declaracao")

  const { data: settings } = await adminSupabase
    .from("certificate_settings")
    .select("logo_url, signature_1_url, signature_1_name, signature_1_role, signature_2_url, signature_2_name, signature_2_role")
    .single()

  return (
    <DeclarationClient
      studentName={profile.full_name}
      formattedCpf={formatCpf(profile.cpf)}
      courseTitle={course.title}
      issuedAt={new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Rio_Branco" }).format(new Date())}
      settings={settings ?? {}}
    />
  )
}

function formatCpf(cpf: string | null) {
  if (!cpf) return "Não informado"

  const digits = cpf.replace(/\D/g, "")
  if (digits.length !== 11) return "Não informado"

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}
