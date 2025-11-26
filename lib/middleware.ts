import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from './auth'
import { prisma } from './prisma'

export async function authenticateRequest(request: NextRequest) {
  try {
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

    // Verificar se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL não configurada no middleware')
      return {
        error: NextResponse.json(
          { error: 'Configuração do banco de dados não encontrada. Verifique as variáveis de ambiente.' },
          { status: 500 }
        ),
        user: null,
      }
    }

    // Verificar se JWT_SECRET está configurada
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não configurada no middleware')
      return {
        error: NextResponse.json(
          { error: 'Configuração de segurança não encontrada. Verifique as variáveis de ambiente.' },
          { status: 500 }
        ),
        user: null,
      }
    }

    // Tentar conectar ao banco antes de buscar usuário
    try {
      await prisma.$connect()
    } catch (dbError: any) {
      console.error('Erro ao conectar ao banco no middleware:', dbError)
      return {
        error: NextResponse.json(
          { 
            error: 'Erro ao conectar ao banco de dados',
            details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
          },
          { status: 500 }
        ),
        user: null,
      }
    }

    const user = await getUserFromToken(token)

    if (!user) {
      return {
        error: NextResponse.json(
          { error: 'Token inválido ou usuário não encontrado' },
          { status: 401 }
        ),
        user: null,
      }
    }

    return { error: null, user }
  } catch (error: any) {
    console.error('Erro no middleware de autenticação:', error)
    
    // Tratar erros específicos do Prisma
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      return {
        error: NextResponse.json(
          { error: 'Não foi possível conectar ao banco de dados. Verifique se o banco está configurado e acessível.' },
          { status: 500 }
        ),
        user: null,
      }
    }

    return {
      error: NextResponse.json(
        { 
          error: 'Erro interno do servidor',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      ),
      user: null,
    }
  }
}






