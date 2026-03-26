import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { CertificateClient } from "./CertificateClient"

export default async function CertificateServerPage({ params }: { params: { courseId: string } }) {
  const courseId = parseInt(params.courseId)
  if (isNaN(courseId)) redirect('/aluno/historico')

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Get Profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')

  // Get requested Course and its corresponding 12 subjects
  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single()
  if (!course) redirect('/aluno/historico')

  const { data: subjects } = await supabase.from('subjects').select('*').eq('course_id', courseId).order('order_index')
  if (!subjects || subjects.length === 0) redirect('/aluno/historico')

  // Verify that the student has PASSED all 12 subjects (>= 7.0 score on 'completed' exams for each subject)
  const { data: attempts } = await supabase
    .from('exam_attempts')
    .select('*, exams(subject_id)')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  if (!attempts) redirect('/aluno/historico')

  let allPassed = true
  let lastCompletionDate: Date | null = null

  // We loop through all 12 subjects to ensure at least one passed attempt exists for each
  for (const subject of subjects) {
    const passedAttempt = attempts.find(a => 
      a.exams?.subject_id === subject.id && 
      a.score !== null && 
      parseFloat(a.score) >= 7.0
    )
    if (!passedAttempt) {
      allPassed = false
      break
    }
    // Track the latest completion date
    const attemptDate = new Date(passedAttempt.finished_at)
    if (!lastCompletionDate || attemptDate > lastCompletionDate) {
      lastCompletionDate = attemptDate
    }
  }

  // If not mathematically eligible, return them to historic pane
  if (!allPassed) {
    redirect('/aluno/historico?error=Você ainda não concluiu todas as matérias deste curso com nota mínima 7.0')
  }

  const hours = courseTitleMatches(course.title, 'básico') ? 360 : 960

  const formattedDate = lastCompletionDate 
    ? lastCompletionDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

  const { data: settings } = await supabase.from('certificate_settings').select('*').single()

  return (
    <CertificateClient 
      studentName={profile.full_name}
      courseTitle={course.title}
      hours={hours}
      completionDate={formattedDate}
      subjects={subjects.map(s => ({ title: s.title }))}
      settings={settings || {}}
    />
  )
}

function courseTitleMatches(title: string, match: string) {
  return title.toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '').includes(match.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''))
}
