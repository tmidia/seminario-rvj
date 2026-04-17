import { createClient } from "./src/utils/supabase/server"

async function debug() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('full_name', '%216%') // Not name, but maybe the CPF is in name? No.
    
  console.log("Searching for 216.896.668-03...")
  const { data: byCpf, error: errorCpf } = await supabase
    .from('profiles')
    .select('*')
    .eq('cpf', '21689666803')
    
  console.log("By CPF (21689666803):", byCpf)
  if (errorCpf) console.error("Error CPF:", errorCpf)

  const { data: all } = await supabase.from('profiles').select('full_name, cpf').limit(10)
  console.log("Recent profiles:", all)
}

debug()
