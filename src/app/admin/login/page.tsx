"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/app/actions/auth-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    const result = await loginAdmin(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl text-center font-serif text-[#0a3a2a]">Acesso Administrativo</CardTitle>
            <CardDescription className="text-center">Seminário Teológico RVJ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b]" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
