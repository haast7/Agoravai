'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await register(email, password, name)
      } else {
        await login(email, password)
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg bg-background-card p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-2xl font-bold text-white">
              4
            </div>
            <h1 className="text-2xl font-bold text-white">TRACKOYOU</h1>
          </div>
          <p className="text-gray-400">TRACKEAMENTO DE DADOS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Nome
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-600/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Carregando...' : isRegister ? 'Registrar' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-gray-400 hover:text-primary"
          >
            {isRegister
              ? 'Já tem conta? Faça login'
              : 'Não tem conta? Registre-se'}
          </button>
        </div>
      </div>
    </div>
  )
}



