"use server"

import { revalidatePath } from "next/cache"
import { createClient as createServerClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { isValidCPF } from "@/utils/cpf"

export async function createStudent(data: FormData) {
  const reqClient = createServerClient()
  const { data: adminData } = await reqClient.auth.getUser()

  if (!adminData?.user) throw new Error("Não autorizado")

  const rawCpf = data.get("cpf") as string
  const cpf = rawCpf.replace(/\D/g, '')

  if (!isValidCPF(cpf)) throw new Error("CPF Inválido. Verifique os números digitados.")
  const fullName = data.get("full_name") as string
  const courseIds = data.getAll("course_ids").map(id => parseInt(id as string))

  if (courseIds.length === 0) throw new Error("Selecione pelo menos um curso")

  const adminSupabase = createAdminClient()

  // 1. Cria o usuário no Auth usando a API Oficial (evita erro 500)
  const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email: `${cpf}.rvj@gmail.com`,
    password: `Rvj@${cpf}`,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  })

  if (authError && authError.message !== 'User already exists') {
    throw new Error(`Erro ao criar acesso: ${authError.message}`)
  }

  // Se o usuário já existia, buscamos o ID dele
  let userId = authUser?.user?.id
  if (!userId && authError?.message === 'User already exists') {
    const { data: existingUser } = await adminSupabase.auth.admin.listUsers()
    userId = existingUser.users.find(u => u.email === `${cpf}.rvj@gmail.com`)?.id
  }

  if (!userId) throw new Error("Não foi possível identificar o ID do usuário.")

  // 2. Atualiza o Perfil na tabela pública
  const { error: profileError } = await adminSupabase
    .from("profiles")
    .upsert({
      id: userId,
      full_name: fullName,
      cpf: cpf,
      role: 'aluno',
      status: 'ativo'
    })

  if (profileError) throw new Error(`Erro no perfil: ${profileError.message}`)

  // 3. Gerencia as matrículas
  await adminSupabase.from("enrollments").delete().eq("profile_id", userId)
  
  if (courseIds && courseIds.length > 0) {
    const enrollments = courseIds.map(courseId => ({
      profile_id: userId,
      course_id: courseId
    }))
    const { error: enrollError } = await adminSupabase.from("enrollments").insert(enrollments)
    if (enrollError) throw new Error(`Erro na matrícula: ${enrollError.message}`)
  }

  revalidatePath("/admin/alunos")
}


export async function updateStudentStatus(userId: string, currentStatus: string) {
  const supabase = createServerClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo'
  const adminClient = createAdminClient()
  
  // 1. Update Profile
  const { error: profileError } = await adminClient
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', userId)

  if (profileError) throw new Error("Erro ao atualizar o status no perfil.")

  // 2. Ban / Unban in Auth
  const banDuration = newStatus === 'inativo' ? '876000h' : 'none'
  await adminClient.auth.admin.updateUserById(userId, { ban_duration: banDuration })

  revalidatePath("/admin/alunos")
}

export async function updateStudent(userId: string, data: FormData) {
  const supabase = createServerClient()
  const { data: adminData } = await supabase.auth.getUser()
  if (!adminData?.user) throw new Error("Não autorizado")

  const rawCpf = data.get("cpf") as string
  const cpf = rawCpf.replace(/\D/g, '')

  if (!isValidCPF(cpf)) throw new Error("CPF Inválido. Verifique os números digitados.")
  const fullName = data.get("full_name") as string
  const email = data.get("email") as string
  const courseIds = data.getAll("course_ids").map(id => parseInt(id as string))

  if (courseIds.length === 0) throw new Error("Selecione pelo menos um curso")

  const adminClient = createAdminClient()

  // 1. Update Auth User if email is provided
  if (email && email.trim() !== '') {
    const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
      email,
      user_metadata: { full_name: fullName }
    })
    if (authError) throw new Error("Erro ao atualizar dados de autenticação: " + authError.message)
  }

  // 2. Update Profile
  const { error: profileError } = await adminClient
    .from('profiles')
    .update({ cpf, full_name: fullName })
    .eq('id', userId)

  if (profileError) throw new Error("Erro ao atualizar perfil do aluno.")

  // 3. Re-enroll
  // Clear old
  await adminClient.from('enrollments').delete().eq('profile_id', userId)
  // Insert new
  const newEnrollments = courseIds.map(cid => ({
    profile_id: userId,
    course_id: cid
  }))
  const { error: enrollError } = await adminClient.from('enrollments').insert(newEnrollments)

  if (enrollError) throw new Error("Erro ao atualizar matrículas do aluno.")

  revalidatePath("/admin/alunos")
}

export async function approveStudentForCertificates(studentId: string) {
  try {
    const supabase = createServerClient()
    const { data: adminData } = await supabase.auth.getUser()
    if (!adminData?.user) return { error: "Não autorizado" }

    const adminSupabase = createAdminClient()

    const { data: profile, error: profileErr } = await adminSupabase.from('profiles').select('enrollments(course_id)').eq('id', studentId).single()
    
    if (profileErr || !profile) {
      return { error: `Erro ao buscar perfil do aluno: ${profileErr?.message || 'Perfil inexistente'}.` }
    }

    const courseIds = profile.enrollments?.map((e: { course_id: number }) => e.course_id) || []
    
    if (courseIds.length === 0) return { error: "O aluno não possui nenhuma matrícula ativa. Clique em Editar e selecione o curso dele antes de aprovar." }

    // Get all subjects for enrolled courses and their exams
    const { data: subjects } = await adminSupabase.from('subjects').select('id, exams(id)').in('course_id', courseIds)
    
    if (!subjects || subjects.length === 0) return { error: "Nenhuma matéria encontrada para os cursos matriculados." }

    const missingExams = subjects.filter((s: { exams?: { id: number }[] }) => !s.exams || s.exams.length === 0)
    if (missingExams.length > 0) {
      // Auto-generate missing exams so the certificate can be emitted
      const examsToCreate = missingExams.map((s: { id: number }) => ({
        subject_id: s.id,
        title: "Avaliação Automática (Aprovação Direta)",
        time_limit_minutes: 120,
        is_active: true
      }))

      const { data: newExams, error: createErr } = await adminSupabase.from('exams').insert(examsToCreate).select('id, subject_id')
      if (createErr || !newExams) return { error: "Erro ao gerar provas automáticas: " + createErr?.message }

      // Re-attach newly created exams to subjects so mapping works below
      missingExams.forEach((s: { id: number, exams?: { id: number }[] }) => {
        const created = newExams.find(ne => ne.subject_id === s.id)
        if (created) s.exams = [{ id: created.id }]
      })
    }

    const examIdsToApprove = subjects.map((s: { exams: { id: number }[] }) => s.exams[0].id)

    // Clear existing attempts for those exact exams to prevent duplication
    await adminSupabase.from('exam_attempts')
      .delete()
      .eq('user_id', studentId)
      .in('exam_id', examIdsToApprove)

    const attemptsToInsert = examIdsToApprove.map((examId: number) => ({
      user_id: studentId,
      exam_id: examId,
      status: 'completed',
      score: 10.0,
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      answers: {}
    }))

    const { error } = await adminSupabase.from('exam_attempts').insert(attemptsToInsert)
    if (error) return { error: "Erro ao gerar aprovações no sistema: " + error.message }

    revalidatePath("/admin/alunos")
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erro crítico interno" }
  }
}
