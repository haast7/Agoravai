import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { execSync } from 'child_process'

/**
 * ROTA TEMPORÁRIA PARA SETUP DO BANCO DE DADOS
 * 
 * ⚠️ IMPORTANTE: Delete esta rota após configurar o banco!
 * 
 * Acesse: https://seu-projeto.vercel.app/api/setup
 * Isso vai criar todas as tabelas no banco de dados.
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se já existe alguma tabela (segurança básica)
    const userCount = await prisma.user.count().catch(() => 0)
    
    if (userCount > 0) {
      return NextResponse.json({
        message: 'Banco de dados já configurado',
        warning: '⚠️ DELETE ESTA ROTA AGORA! (app/api/setup/route.ts)',
        userCount,
      })
    }

    // Verificar se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error: 'DATABASE_URL não configurada',
          tip: 'Configure a variável DATABASE_URL no Vercel (Settings → Environment Variables)',
        },
        { status: 500 }
      )
    }

    // Tentar executar prisma db push via execSync
    // Isso vai criar todas as tabelas no banco
    let pushSuccess = false
    try {
      execSync('npx prisma db push --accept-data-loss', {
        stdio: 'pipe',
        env: process.env,
        cwd: process.cwd(),
      })
      pushSuccess = true
    } catch (execError: any) {
      console.error('Erro ao executar prisma db push:', execError.message)
      // Continuar para tentar verificar conexão manualmente
    }

    // Tentar verificar conexão e criar tabelas manualmente se necessário
    try {
      await prisma.$connect()
      
      // Tentar verificar se as tabelas existem
      await prisma.$executeRawUnsafe(`
        SELECT 1;
      `)
    } catch (dbError: any) {
      return NextResponse.json(
        {
          error: 'Erro ao conectar ao banco de dados',
          details: dbError.message,
          tip: 'Verifique se a DATABASE_URL está correta e se o banco está acessível',
        },
        { status: 500 }
      )
    }

    // Verificar se funcionou
    const testConnection = await prisma.user.count().catch(() => null)
    
    if (testConnection === null) {
      return NextResponse.json({
        message: 'Banco conectado, mas tabelas podem não estar criadas',
        warning: 'Execute manualmente: npx prisma db push',
        tip: 'Ou use Vercel CLI: vercel env pull && npx prisma db push',
      })
    }

    return NextResponse.json({
      message: 'Banco de dados configurado com sucesso! ✅',
      warning: '⚠️ DELETE ESTA ROTA AGORA! (app/api/setup/route.ts)',
      nextSteps: [
        '1. Acesse https://seu-projeto.vercel.app/login',
        '2. Crie sua conta',
        '3. Delete este arquivo (app/api/setup/route.ts)',
      ],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Erro ao configurar banco',
        details: error.message,
        tip: 'Certifique-se de que a DATABASE_URL está configurada corretamente no Vercel',
        alternative: 'Use Vercel CLI: vercel env pull .env.local && npx prisma db push',
      },
      { status: 500 }
    )
  }
}

