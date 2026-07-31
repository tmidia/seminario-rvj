/**
 * Sem tipos gerados do banco, o supabase-js infere relacionamentos aninhados
 * como array, mas o PostgREST devolve um objeto único em relações "muitos para
 * um" (ex.: enrollments -> courses). Normaliza os dois formatos.
 */
export function singleRelation<T>(value: unknown): T | null {
  if (Array.isArray(value)) return (value[0] as T | undefined) ?? null
  return (value as T | null | undefined) ?? null
}
