"use server"

import { createAdminClient } from "@/utils/supabase/admin"

export async function ensureCertificatesBucket() {
  const adminSupabase = createAdminClient()

  // 1. Check if bucket exists
  const { data: buckets, error: listError } = await adminSupabase.storage.listBuckets()
  
  if (listError) {
    console.error("Error listing buckets:", listError)
    return { error: listError.message }
  }

  const exists = buckets.some(b => b.name === 'certificates')

  if (!exists) {
    // 2. Create the bucket
    const { error: createError } = await adminSupabase.storage.createBucket('certificates', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (createError) {
      console.error("Error creating bucket:", createError)
      return { error: createError.message }
    }
  }

  return { success: true }
}
