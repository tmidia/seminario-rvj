import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    // Attempt to see if we can find any admin profiles using the standard client
    // If RLS allows selecting profiles (unlikely but possible), this will work
    const { data: admins, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('role', 'admin')

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ admins })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
