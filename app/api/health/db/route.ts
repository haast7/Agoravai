import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Verificar variáveis de ambiente
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const databaseUrlPreview = process.env.DATABASE_URL
      ? `${process.env.DATABASE_URL.split('@')[0]}@***` // Ocultar senha
      : 'Não configurado'

    // Tentar conectar ao banco
    await prisma.$connect()
    
    // Tentar uma query simples
    await prisma.$queryRaw`SELECT 1`
    
    // Verificar se as tabelas existem
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `

    await prisma.$disconnect()

    return NextResponse.json({
      status: 'ok',
      database: {
        connected: true,
        urlConfigured: hasDatabaseUrl,
        urlPreview: databaseUrlPreview,
        tablesFound: tables.length,
        tables: tables.map(t => t.tablename),
      },
      environment: process.env.NODE_ENV,
    })
  } catch (error: any) {
    console.error('❌ [Health Check] Erro ao verificar banco:', error)
    
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const databaseUrlPreview = process.env.DATABASE_URL
      ? `${process.env.DATABASE_URL.split('@')[0]}@***`
      : 'Não configurado'

    return NextResponse.json(
      {
        status: 'error',
        database: {
          connected: false,
          urlConfigured: hasDatabaseUrl,
          urlPreview: databaseUrlPreview,
          error: {
            code: error.code,
            message: error.message,
            name: error.name,
          },
        },
        environment: process.env.NODE_ENV,
        troubleshooting: {
          steps: [
            'Verifique se DATABASE_URL está configurada nas variáveis de ambiente da Vercel',
            'Verifique se o banco de dados PostgreSQL está acessível do servidor da Vercel',
            'Verifique se o firewall permite conexões do IP da Vercel',
            'Execute: npx prisma generate && npx prisma db push',
          ],
        },
      },
      { status: 500 }
    )
  }
}

