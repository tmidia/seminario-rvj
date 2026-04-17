"use server"

import { createAdminClient } from "@/utils/supabase/admin"

export async function uploadCertificateAsset(formData: FormData) {
  try {
    const file = formData.get('file') as File
    const field = formData.get('field') as string

    if (!file || !field) {
      return { error: "Arquivo ou campo não fornecido." }
    }

    const adminSupabase = createAdminClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `${field}_${Date.now()}.${fileExt}`

    // Convert File to ArrayBuffer for Supabase Upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await adminSupabase.storage
      .from('certificates')
      .upload(fileName, buffer, { 
        upsert: true,
        contentType: file.type
      })

    if (uploadError) {
      console.error("Upload Error:", uploadError)
      return { error: `Erro no upload: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = adminSupabase.storage
      .from('certificates')
      .getPublicUrl(fileName)

    return { success: true, url: publicUrl }
  } catch (e: unknown) {
    console.error("Critical Upload Error:", e)
    return { error: e instanceof Error ? e.message : "Erro interno no servidor." }
  }
}
