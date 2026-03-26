import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { CertificateSettingsForm } from "./CertificateSettingsForm"

export default async function CertificateSettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch current config
  const { data: settings } = await supabase
    .from('certificate_settings')
    .select('*')
    .single()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0a3a2a]">Layout do Certificado</h1>
          <p className="text-slate-500 mt-2">Personalize logos, assinaturas e o espaçamento do certificado emitido aos alunos.</p>
        </div>
      </div>
      
      <CertificateSettingsForm initialSettings={settings || {}} />
    </div>
  )
}
