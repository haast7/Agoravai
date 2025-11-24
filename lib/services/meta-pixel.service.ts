import axios from 'axios'

interface MetaPixelEvent {
  event_name: string
  event_time: number
  action_source: string
  user_data?: {
    client_ip_address?: string
    client_user_agent?: string
  }
  custom_data?: Record<string, any>
}

export class MetaPixelService {
  private apiVersion = process.env.META_API_VERSION || 'v21.0'

  async sendEvent(
    pixelId: string,
    accessToken: string,
    event: MetaPixelEvent
  ): Promise<boolean> {
    try {
      // Usar query parameter para access_token
      const url = new URL(`https://graph.facebook.com/${this.apiVersion}/${pixelId}/events`)
      url.searchParams.set('access_token', accessToken)
      
      const response = await axios.post(
        url.toString(),
        {
          data: [event],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return response.status === 200
    } catch (error) {
      console.error('Erro ao enviar evento para Meta Pixel:', error)
      return false
    }
  }

  async sendEnterChannelEvent(
    pixelId: string,
    accessToken: string,
    userIp?: string,
    userAgent?: string,
    customData?: Record<string, any>
  ): Promise<boolean> {
    const event: MetaPixelEvent = {
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        client_ip_address: userIp,
        client_user_agent: userAgent,
      },
      custom_data: {
        content_name: 'Enter Channel',
        ...customData,
      },
    }

    return this.sendEvent(pixelId, accessToken, event)
  }

  /**
   * Valida se o Pixel ID e Token são válidos verificando acesso ao pixel
   */
  async validatePixel(
    pixelId: string,
    accessToken: string
  ): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      // Verificar se temos acesso ao pixel usando a API do Graph
      const url = new URL(`https://graph.facebook.com/${this.apiVersion}/${pixelId}`)
      url.searchParams.set('access_token', accessToken)
      url.searchParams.set('fields', 'id,name')
      
      const response = await axios.get(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200 && response.data?.id) {
        return { success: true }
      }

      return { 
        success: false, 
        error: 'Não foi possível validar o pixel',
        details: response.data 
      }
    } catch (error: any) {
      console.error('Erro ao validar pixel:', error)
      
      // Extrair mensagem de erro específica da API do Meta
      let errorMessage = 'Erro desconhecido'
      let errorDetails = null

      if (error.response) {
        // Erro da API do Meta
        const metaError = error.response.data?.error || error.response.data
        errorMessage = metaError?.message || `Erro ${error.response.status}`
        errorDetails = metaError

        // Mensagens mais específicas baseadas no código de erro
        if (metaError?.code === 190) {
          errorMessage = 'Token de acesso inválido ou expirado'
        } else if (metaError?.code === 100) {
          errorMessage = 'Pixel ID inválido ou não encontrado. Verifique se o ID está correto.'
        } else if (metaError?.code === 10) {
          errorMessage = 'Token de acesso não tem permissão para acessar este pixel'
        } else if (metaError?.type === 'OAuthException') {
          errorMessage = 'Token de acesso inválido ou sem permissões necessárias'
        }
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar à API do Meta. Verifique sua conexão.'
      } else {
        errorMessage = error.message || 'Erro ao validar pixel'
      }

      return { 
        success: false, 
        error: errorMessage,
        details: errorDetails || error.response?.data
      }
    }
  }

  async testEvent(
    pixelId: string,
    accessToken: string,
    testEventCode?: string
  ): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      // Usar query parameter para access_token (mais confiável)
      const url = new URL(`https://graph.facebook.com/${this.apiVersion}/${pixelId}/events`)
      url.searchParams.set('access_token', accessToken)
      if (testEventCode) {
        url.searchParams.set('test_event_code', testEventCode)
      }
      
      // Adicionar informações básicas do cliente para evitar erro 2804050
      const response = await axios.post(
        url.toString(),
        {
          data: [{
            event_name: 'PageView',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: {
              client_ip_address: '127.0.0.1',
              client_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 200) {
        return { success: true }
      }

      return { 
        success: false, 
        error: 'Resposta inesperada da API',
        details: response.data 
      }
    } catch (error: any) {
      console.error('Erro ao testar evento:', error)
      
      // Extrair mensagem de erro específica da API do Meta
      let errorMessage = 'Erro desconhecido'
      let errorDetails = null

      if (error.response) {
        // Erro da API do Meta
        const metaError = error.response.data?.error || error.response.data
        errorMessage = metaError?.message || `Erro ${error.response.status}`
        errorDetails = metaError

        // Mensagens mais específicas baseadas no código de erro
        if (metaError?.code === 190) {
          errorMessage = 'Token de acesso inválido ou expirado'
        } else if (metaError?.code === 100) {
          errorMessage = 'Pixel ID inválido ou não encontrado'
        } else if (metaError?.type === 'OAuthException') {
          errorMessage = 'Token de acesso inválido ou sem permissões'
        }
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar à API do Meta'
      } else {
        errorMessage = error.message || 'Erro ao validar pixel'
      }

      return { 
        success: false, 
        error: errorMessage,
        details: errorDetails || error.response?.data
      }
    }
  }
}

export const metaPixelService = new MetaPixelService()



