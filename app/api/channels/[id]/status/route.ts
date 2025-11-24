import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'
import { telegramService } from '@/lib/services/telegram.service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const channel = await prisma.channel.findUnique({
      where: { id: params.id },
    })

    if (!channel || channel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Canal não encontrado' },
        { status: 404 }
      )
    }

    // Verificar status do bot
    const botInfo = await telegramService.getBotInfo(channel.botToken)
    const botConnected = !!botInfo

    // Verificar conexão com canal
    let channelStatus = {
      connected: false,
      channelType: null as 'private' | 'public' | null,
      interference: false,
    }

    if (channel.channelId) {
      channelStatus = await telegramService.checkChannelConnection(
        channel.botToken,
        channel.channelId
      )
    }

    return NextResponse.json({
      bot: {
        connectedToSystem: botConnected,
        connectedToChannel: channelStatus.connected,
      },
      channel: {
        type: channelStatus.channelType || channel.channelType || 'private',
        interference: channelStatus.interference,
      },
    })
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar status' },
      { status: 500 }
    )
  }
}



