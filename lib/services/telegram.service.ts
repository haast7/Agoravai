import TelegramBot from 'node-telegram-bot-api'
import { prisma } from '../prisma'

interface TelegramBotInstance {
  bot: TelegramBot
  channelId: string
  funnelId: string
}

const botInstances = new Map<string, TelegramBotInstance>()

export class TelegramService {
  async createBotInstance(
    botToken: string,
    channelId: string,
    funnelId: string
  ): Promise<TelegramBot> {
    const key = `${botToken}-${channelId}`
    
    if (botInstances.has(key)) {
      return botInstances.get(key)!.bot
    }

    const bot = new TelegramBot(botToken, { polling: false })

    // Configurar webhook para detectar entrada/saída
    bot.on('new_chat_members', async (msg) => {
      if (msg.chat.id.toString() === channelId) {
        await this.handleChannelEntry(msg, funnelId)
      }
    })

    bot.on('left_chat_member', async (msg) => {
      if (msg.chat.id.toString() === channelId) {
        await this.handleChannelExit(msg, funnelId)
      }
    })

    botInstances.set(key, { bot, channelId, funnelId })
    return bot
  }

  async getBotInfo(botToken: string): Promise<{
    id: number
    username: string
    first_name: string
  } | null> {
    try {
      const bot = new TelegramBot(botToken, { polling: false })
      const me = await bot.getMe()
      // Converter o tipo User do Telegram para o formato esperado
      return {
        id: me.id,
        username: me.username || '',
        first_name: me.first_name || '',
      }
    } catch (error) {
      console.error('Erro ao obter informações do bot:', error)
      return null
    }
  }

  async checkChannelConnection(
    botToken: string,
    channelId: string
  ): Promise<{
    connected: boolean
    channelType?: 'private' | 'public'
    interference?: boolean
  }> {
    try {
      const bot = new TelegramBot(botToken, { polling: false })
      
      // Obter informações do bot
      const botInfo = await bot.getMe()
      
      // Tentar obter informações do canal usando o ID
      let chat
      try {
        // Se o channelId começa com @, é um username, senão é um ID numérico
        if (channelId.startsWith('@')) {
          chat = await bot.getChat(channelId)
        } else {
          // Converter para número se necessário
          const numericId = channelId.startsWith('-') ? channelId : `-${channelId}`
          chat = await bot.getChat(numericId)
        }
      } catch (error) {
        console.error('Erro ao obter informações do canal:', error)
        return {
          connected: false,
        }
      }

      const channelType = chat.type === 'private' || chat.type === 'group' ? 'private' : 'public'
      
      // Verificar se o bot é administrador
      try {
        const admins = await bot.getChatAdministrators(chat.id)
        const isAdmin = admins.some((admin) => admin.user.id === botInfo.id)

        return {
          connected: isAdmin,
          channelType,
          interference: false, // Implementar lógica de verificação de interferência
        }
      } catch (error) {
        // Se não conseguir obter administradores, o bot não é admin
        return {
          connected: false,
          channelType,
          interference: false,
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conexão do canal:', error)
      return {
        connected: false,
      }
    }
  }

  async generateInviteLink(
    botToken: string,
    channelId: string
  ): Promise<string | null> {
    try {
      const bot = new TelegramBot(botToken, { polling: false })
      
      // Criar link de convite com parâmetros de tracking
      const inviteLink = await bot.exportChatInviteLink(channelId)
      return inviteLink
    } catch (error) {
      console.error('Erro ao gerar link de convite:', error)
      return null
    }
  }

  private async handleChannelEntry(msg: TelegramBot.Message, funnelId: string) {
    try {
      const funnel = await prisma.funnel.findUnique({
        where: { id: funnelId },
        include: { pixel: true },
      })

      if (!funnel || !funnel.pixel) return

      // Registrar evento de entrada
      await prisma.event.create({
        data: {
          funnelId,
          type: 'EnterChannel',
          metadata: {
            userId: msg.from?.id,
            username: msg.from?.username,
          },
        },
      })

      // Enviar evento para Meta Pixel
      const { metaPixelService } = await import('./meta-pixel.service')
      await metaPixelService.sendEnterChannelEvent(
        funnel.pixel.pixelId,
        funnel.pixel.accessToken,
        undefined,
        undefined,
        {
          funnel_id: funnelId,
          funnel_name: funnel.name,
        }
      )

      // Disparar postbacks do tipo EnterChannel
      const postbacks = await prisma.postback.findMany({
        where: {
          funnelId,
          type: 'EnterChannel',
        },
      })

      for (const postback of postbacks) {
        try {
          await fetch(postback.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'EnterChannel',
              funnelId,
              timestamp: new Date().toISOString(),
            }),
          })
        } catch (error) {
          console.error('Erro ao disparar postback:', error)
        }
      }
    } catch (error) {
      console.error('Erro ao processar entrada no canal:', error)
    }
  }

  private async handleChannelExit(msg: TelegramBot.Message, funnelId: string) {
    try {
      // Registrar evento de saída
      await prisma.event.create({
        data: {
          funnelId,
          type: 'ExitChannel',
          metadata: {
            userId: msg.from?.id,
            username: msg.from?.username,
          },
        },
      })

      // Disparar postbacks do tipo ExitChannel
      const postbacks = await prisma.postback.findMany({
        where: {
          funnelId,
          type: 'ExitChannel',
        },
      })

      for (const postback of postbacks) {
        try {
          await fetch(postback.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'ExitChannel',
              funnelId,
              timestamp: new Date().toISOString(),
            }),
          })
        } catch (error) {
          console.error('Erro ao disparar postback:', error)
        }
      }
    } catch (error) {
      console.error('Erro ao processar saída do canal:', error)
    }
  }
}

export const telegramService = new TelegramService()



