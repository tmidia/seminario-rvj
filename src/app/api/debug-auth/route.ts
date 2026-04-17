import { createAdminClient } from "@/utils/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const adminSupabase = createAdminClient()
    
    // 1. Get all profiles with role 'admin'
    const { data: admins, error: profileError } = await adminSupabase
      .from('profiles')
      .select('id, full_name, role, cpf')
      .eq('role', 'admin')

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // 2. Map to their Auth emails
    const adminDetails = await Promise.all((admins || []).map(async (admin) => {
      const { data: authUser } = await adminSupabase.auth.admin.getUserById(admin.id)
      return {
        ...admin,
        email: authUser?.user?.email || 'N/A'
      }
    }))

    return NextResponse.json({ admins: adminDetails })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
