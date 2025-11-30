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
      console.error('❌ [Middleware] Erro ao conectar ao banco:', {
        code: dbError.code,
        message: dbError.message,
        name: dbError.name,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPreview: process.env.DATABASE_URL 
          ? `${process.env.DATABASE_URL.split('@')[0]}@***` 
          : 'Não configurado',
        environment: process.env.NODE_ENV,
      })
      
      // Log detalhado para diagnóstico
      if (dbError.code === 'P1001') {
        console.error('❌ [Middleware] Erro P1001: Não foi possível alcançar o servidor do banco')
        console.error('❌ [Middleware] Verifique: PostgreSQL está rodando? DATABASE_URL está correto?')
      } else if (dbError.code === 'P1000') {
        console.error('❌ [Middleware] Erro P1000: Falha de autenticação')
        console.error('❌ [Middleware] Verifique: Senha no DATABASE_URL está correta?')
      } else if (dbError.code === 'P1003') {
        console.error('❌ [Middleware] Erro P1003: Banco de dados não existe')
        console.error('❌ [Middleware] Verifique: Banco track4you foi criado?')
      }
      
      return {
        error: NextResponse.json(
          { 
            error: 'Erro ao conectar ao banco de dados',
            details: {
              code: dbError.code,
              message: dbError.message,
              hint: dbError.code === 'P1001' 
                ? 'Verifique se o PostgreSQL está rodando e se o DATABASE_URL está correto'
                : dbError.code === 'P1000'
                ? 'Verifique se a senha no DATABASE_URL está correta'
                : dbError.code === 'P1003'
                ? 'Verifique se o banco de dados track4you foi criado'
                : 'Verifique as configurações do banco de dados'
            }
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






