import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  await supabase.auth.signOut()
  
  const referer = request.headers.get("referer") || ""
  const redirectUrl = referer.includes("/aluno") ? "/" : "/admin/login"
  
  return NextResponse.redirect(new URL(redirectUrl, request.url), {
    status: 302,
  })
}
