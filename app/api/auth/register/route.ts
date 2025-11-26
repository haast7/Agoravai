import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL não configurada')
      return NextResponse.json(
        { error: 'Configuração do banco de dados não encontrada. Verifique as variáveis de ambiente.' },
        { status: 500 }
      )
    }

    // Verificar se JWT_SECRET está configurada
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não configurada')
      return NextResponse.json(
        { error: 'Configuração de segurança não encontrada. Verifique as variáveis de ambiente.' },
        { status: 500 }
      )
    }

    // Tentar conectar ao banco
    try {
      await prisma.$connect()
    } catch (dbError: any) {
      console.error('Erro ao conectar ao banco:', dbError)
      return NextResponse.json(
        { 
          error: 'Erro ao conectar ao banco de dados',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 500 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    })

    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error: any) {
    console.error('Erro no registro:', error)
    
    // Mensagem mais específica para erros conhecidos
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { error: 'Não foi possível conectar ao banco de dados. Verifique se o banco está configurado e acessível.' },
        { status: 500 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}





