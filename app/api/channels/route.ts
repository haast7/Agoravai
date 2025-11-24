import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'
import { telegramService } from '@/lib/services/telegram.service'

export async function GET(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const channels = await prisma.channel.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        botName: true,
        botToken: true,
        channelId: true,
        channelType: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(channels)
  } catch (error) {
    console.error('Erro ao buscar canais:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar canais' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const { name, botName, botToken, channelId, channelType } = await request.json()

    if (!name || !botName || !botToken) {
      return NextResponse.json(
        { error: 'Nome, Nome do Bot e Token são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar token do bot
    const botInfo = await telegramService.getBotInfo(botToken)
    
    if (!botInfo) {
      return NextResponse.json(
        { error: 'Token do bot inválido' },
        { status: 400 }
      )
    }

    // Verificar se o token já existe
    const existingChannel = await prisma.channel.findUnique({
      where: { botToken },
    })

    if (existingChannel) {
      return NextResponse.json(
        { error: 'Este bot já está cadastrado' },
        { status: 400 }
      )
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        botName,
        botToken,
        userId: user!.id,
        ...(channelId && { channelId: channelId.trim() }),
        ...(channelType && { channelType }),
      },
      select: {
        id: true,
        name: true,
        botName: true,
        botToken: true,
        channelId: true,
        channelType: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(channel)
  } catch (error: any) {
    console.error('Erro ao criar canal:', error)
    return NextResponse.json(
      { error: 'Erro ao criar canal' },
      { status: 500 }
    )
  }
}



