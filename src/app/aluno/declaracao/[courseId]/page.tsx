import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { singleRelation } from "@/utils/relation"
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

  const course = singleRelation<Course>(enrollment?.courses)
  if (!course) redirect("/aluno/declaracao")

  // Mesma regra do certificado: o curso só é considerado concluído quando existe
  // uma tentativa aprovada (nota >= 7) em cada matéria do curso.
  const [{ data: subjects }, { data: attempts }] = await Promise.all([
    adminSupabase.from("subjects").select("id").eq("course_id", courseId),
    adminSupabase
      .from("exam_attempts")
      .select("score, finished_at, exams(subject_id)")
      .eq("user_id", user.id)
      .eq("status", "completed"),
  ])

  const courseSubjectIds = new Set<number>((subjects ?? []).map((subject) => subject.id))
  const passedSubjectIds = new Set<number>()
  let lastCompletion: Date | null = null

  for (const attempt of attempts ?? []) {
    const exam = singleRelation<{ subject_id: number }>(attempt.exams)
    const score = Number.parseFloat(String(attempt.score))

    if (!exam || !courseSubjectIds.has(exam.subject_id)) continue
    if (!Number.isFinite(score) || score < 7) continue

    passedSubjectIds.add(exam.subject_id)

    const finishedAt = attempt.finished_at ? new Date(attempt.finished_at) : null
    if (finishedAt && !Number.isNaN(finishedAt.getTime()) && (!lastCompletion || finishedAt > lastCompletion)) {
      lastCompletion = finishedAt
    }
  }

  const isCompleted =
    courseSubjectIds.size > 0 &&
    Array.from(courseSubjectIds).every((subjectId) => passedSubjectIds.has(subjectId))

  const { data: settings } = await adminSupabase
    .from("certificate_settings")
    .select("logo_url, signature_1_url, signature_1_name, signature_1_role, signature_2_url, signature_2_name, signature_2_role")
    .maybeSingle()

  return (
    <DeclarationClient
      studentName={profile.full_name || "Aluno(a)"}
      formattedCpf={formatCpf(profile.cpf)}
      courseTitle={course.title}
      issuedAt={formatDate(new Date())}
      isCompleted={isCompleted}
      completionDate={isCompleted && lastCompletion ? formatDate(lastCompletion) : null}
      settings={settings ?? {}}
    />
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" }).format(date)
}

function formatCpf(cpf: string | null) {
  if (!cpf) return "Não informado"

  const digits = cpf.replace(/\D/g, "")
  if (digits.length !== 11) return "Não informado"

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}
