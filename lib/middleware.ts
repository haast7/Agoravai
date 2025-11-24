import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from './auth'

export async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      ),
      user: null,
    }
  }

  const user = await getUserFromToken(token)

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      ),
      user: null,
    }
  }

  return { error: null, user }
}



