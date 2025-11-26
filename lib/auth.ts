import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

export interface UserPayload {
  userId: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string | null | undefined) {
  if (!token) return null
  
  const payload = verifyToken(token)
  if (!payload) return null

  try {
    // Verificar conexão com banco antes de fazer query
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL não configurada')
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return user
  } catch (error: any) {
    console.error('Erro ao buscar usuário do token:', error)
    // Em caso de erro de conexão, retornar null para evitar quebrar a autenticação
    // O middleware vai tratar isso adequadamente
    return null
  }
}






