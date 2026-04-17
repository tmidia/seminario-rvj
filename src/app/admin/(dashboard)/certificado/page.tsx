import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import { CertificateSettingsForm } from "./CertificateSettingsForm"
import { ensureCertificatesBucket } from "@/app/actions/initialize-storage"

export default async function CertificateSettingsPage() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Ensure storage is ready
  await ensureCertificatesBucket()

  // Fetch current config
  const { data: settings } = await adminSupabase
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
