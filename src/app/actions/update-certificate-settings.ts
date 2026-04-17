"use server"

import { revalidatePath } from "next/cache"
import { createClient as createServerClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

interface CertificateSettings {
  signature_1_name?: string
  signature_1_role?: string
  signature_2_name?: string
  signature_2_role?: string
  layout_scale?: number
  margin_top?: number
  logo_url?: string
  seal_url?: string
  signature_1_url?: string
  signature_2_url?: string
  bg_image_url?: string
}

export async function updateCertificateSettings(settings: CertificateSettings) {
  try {
    const supabase = createServerClient()
    const { data: adminData } = await supabase.auth.getUser()
    
    if (!adminData?.user) {
      return { error: "Não autorizado" }
    }

    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
      .from('certificate_settings')
      .update({
        signature_1_name: settings.signature_1_name,
        signature_1_role: settings.signature_1_role,
        signature_2_name: settings.signature_2_name,
        signature_2_role: settings.signature_2_role,
        layout_scale: settings.layout_scale,
        margin_top: settings.margin_top,
        logo_url: settings.logo_url,
        seal_url: settings.seal_url,
        signature_1_url: settings.signature_1_url,
        signature_2_url: settings.signature_2_url,
        bg_image_url: settings.bg_image_url,
      })
      .eq('id', '00000000-0000-0000-0000-000000000000')

    if (error) {
      console.error("Save Settings Error:", error)
      return { error: `Erro ao salvar no banco: ${error.message}` }
    }

    revalidatePath("/admin/certificado")
    revalidatePath("/aluno/certificado/[courseId]", "page")
    
    return { success: true }
  } catch (e: unknown) {
    console.error("Critical Settings Save Error:", e)
    return { error: e instanceof Error ? e.message : "Erro interno no servidor." }
  }
}
