import { createAdminClient } from "@/utils/supabase/admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Simple protection: only allow if a secret matches or just run it once
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  
  if (secret !== 'restaurar') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const adminSupabase = createAdminClient()
    
    // 1. Try to find the admin user
    const email = 'tmidiamkt@gmail.com'
    const password = 'Admin@RVJ2026'

    console.log("Starting account recovery for:", email)

    // Check if user exists in profiles
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single()

    if (profile) {
      console.log("Admin profile found. Resetting password...")
      const { error: resetError } = await adminSupabase.auth.admin.updateUserById(profile.id, {
        password: password
      })
      if (resetError) throw resetError
      return NextResponse.json({ success: true, message: `Senha do administrador resetada para: ${password}`, email })
    } else {
      console.log("No admin found. Creating new admin...")
      const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Administrador Principal' }
      })

      if (createError) throw createError

      const { error: profError } = await adminSupabase.from('profiles').upsert({
        id: newUser.user.id,
        full_name: 'Administrador Principal',
        role: 'admin',
        cpf: '00000000000'
      })

      if (profError) throw profError

      return NextResponse.json({ success: true, message: `Novo administrador criado: ${email}`, password })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
