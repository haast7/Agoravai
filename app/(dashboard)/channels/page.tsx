'use client'

import { useEffect, useState } from 'react'
import { channelsApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Trash2, CheckCircle2, XCircle, Settings } from 'lucide-react'

export default function ChannelsPage() {
  const [channels, setChannels] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    botName: '',
    botToken: '',
    channelId: '',
    channelType: 'private' as 'private' | 'public',
  })
  const [channelConfig, setChannelConfig] = useState({
    channelId: '',
    channelType: 'private' as 'private' | 'public',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statuses, setStatuses] = useState<Record<string, any>>({})

  useEffect(() => {
    loadChannels()
  }, [])

  const loadChannels = async () => {
    try {
      const data = await channelsApi.list()
      setChannels(data)
      
      // Carregar status de cada canal
      for (const channel of data) {
        try {
          const status = await channelsApi.getStatus(channel.id)
          setStatuses((prev) => ({ ...prev, [channel.id]: status }))
        } catch (error) {
          console.error('Erro ao carregar status:', error)
        }
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.botName || !formData.botToken) {
      setError('Nome, Nome do Bot e Token são obrigatórios')
      return
    }

    setLoading(true)
    setError('')

    try {
      await channelsApi.create(
        formData.name,
        formData.botName,
        formData.botToken,
        formData.channelId.trim() || undefined,
        formData.channelType
      )
      
      setFormData({ 
        name: '', 
        botName: '', 
        botToken: '',
        channelId: '',
        channelType: 'private',
      })
      setIsModalOpen(false)
      await loadChannels()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este canal?')) return

    try {
      await channelsApi.delete(id)
      await loadChannels()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleOpenConfig = (channel: any) => {
    setSelectedChannel(channel)
    setChannelConfig({
      channelId: channel.channelId || '',
      channelType: (channel.channelType as 'private' | 'public') || 'private',
    })
    setIsConfigModalOpen(true)
  }

  const handleSaveConfig = async () => {
    if (!selectedChannel) return

    if (!channelConfig.channelId.trim()) {
      setError('ID do Canal é obrigatório')
      return
    }

    setLoading(true)
    setError('')

    try {
      await channelsApi.update(selectedChannel.id, {
        channelId: channelConfig.channelId.trim(),
        channelType: channelConfig.channelType,
      })
      setIsConfigModalOpen(false)
      setSelectedChannel(null)
      await loadChannels()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Canal</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Novo</Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-600/20 p-4 text-red-400">{error}</div>
      )}

      {channels.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <h3 className="mb-4 text-lg font-bold text-white">Status do Bot</h3>
            <div className="space-y-3">
              {channels.map((channel) => {
                const status = statuses[channel.id]
                return (
                  <div key={channel.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Conexão com a Track4you
                    </span>
                    <div className="flex items-center gap-2">
                      {status?.bot?.connectedToSystem ? (
                        <>
                          <CheckCircle2 className="text-green-500" size={20} />
                          <span className="text-sm text-green-500">Conectado!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-500" size={20} />
                          <span className="text-sm text-red-500">Desconectado</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
              {channels.map((channel) => {
                const status = statuses[channel.id]
                return (
                  <div key={`${channel.id}-channel`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Conexão com o Canal
                    </span>
                    <div className="flex items-center gap-2">
                      {status?.bot?.connectedToChannel ? (
                        <>
                          <CheckCircle2 className="text-green-500" size={20} />
                          <span className="text-sm text-green-500">Conectado!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-500" size={20} />
                          <span className="text-sm text-red-500">Desconectado</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-bold text-white">Status do Canal</h3>
            <div className="space-y-3">
              {channels.map((channel) => {
                const status = statuses[channel.id]
                return (
                  <div key={channel.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Tipo do Canal</span>
                    <span className="text-sm text-white">
                      {status?.channel?.type === 'private'
                        ? 'Privado (Recomendado)'
                        : 'Público'}
                    </span>
                  </div>
                )
              })}
              {channels.map((channel) => {
                const status = statuses[channel.id]
                return (
                  <div key={`${channel.id}-interference`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Verificação de interferências
                    </span>
                    <span className="text-sm text-green-500">
                      {status?.channel?.interference
                        ? 'Interferência detectada'
                        : 'Nenhuma interferência detectada.'}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      <Card>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                NOME DO CANAL
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                NOME DO BOT
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                TOKEN
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {channels.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Nenhum canal cadastrado
                </td>
              </tr>
            ) : (
              channels.map((channel) => (
                <tr key={channel.id} className="border-b border-gray-800">
                  <td className="px-4 py-3 text-white">{channel.name}</td>
                  <td className="px-4 py-3 text-white">{channel.botName}</td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-400">
                    {channel.botToken ? `${channel.botToken.substring(0, 20)}...` : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(channel.id)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Deletar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {channels.length > 0 && (
        <Card>
          <div className="rounded-lg bg-red-600/20 p-4">
            <p className="text-sm text-red-400">
              ⚠️ Importante: Para garantir o correto funcionamento, o bot
              configurado para a Track4you não deve ser utilizado simultaneamente
              em outras plataformas ou para outras finalidades. O uso indevido pode
              causar interferências e comprometer as funcionalidades da Track4you
            </p>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ 
            name: '', 
            botName: '', 
            botToken: '',
            channelId: '',
            channelType: 'private' as 'private' | 'public'
          })
          setError('')
        }}
        title="Novo Canal"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Nome do Canal
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Método X | Bac Bo | Mentor BT"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Nome do Bot
            </label>
            <Input
              value={formData.botName}
              onChange={(e) =>
                setFormData({ ...formData, botName: e.target.value })
              }
              placeholder="Ex: mentorbttrack4youbot_bot"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Token do Bot
            </label>
            <Input
              value={formData.botToken}
              onChange={(e) =>
                setFormData({ ...formData, botToken: e.target.value })
              }
              placeholder="8255211068:AAE9VswRYLwNPtJvLG3TJT2yeEM_BKek5Vo"
              type="password"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              ID do Canal/Grupo <span className="text-gray-500">(Opcional)</span>
            </label>
            <Input
              value={formData.channelId}
              onChange={(e) =>
                setFormData({ ...formData, channelId: e.target.value })
              }
              placeholder="-1001234567890"
            />
            <p className="mt-2 text-xs text-gray-400">
              Para obter o ID: Adicione o bot @userinfobot no seu grupo e ele mostrará o ID (número negativo)
            </p>
          </div>

          {formData.channelId && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Tipo do Canal
              </label>
              <select
                value={formData.channelType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    channelType: e.target.value as 'private' | 'public',
                  })
                }
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="private">Privado (Recomendado)</option>
                <option value="public">Público</option>
              </select>
            </div>
          )}

          {formData.channelId && (
            <div className="rounded-lg bg-yellow-600/20 p-3">
              <p className="text-sm text-yellow-400">
                ⚠️ Certifique-se de que o bot é administrador do grupo/canal antes de salvar.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-600/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ 
                  name: '', 
                  botName: '', 
                  botToken: '',
                  channelId: '',
                  channelType: 'private' as 'private' | 'public',
                })
                setError('')
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Configuração do Canal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false)
          setSelectedChannel(null)
          setChannelConfig({ channelId: '', channelType: 'private' })
          setError('')
        }}
        title="Configurar Canal"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              ID do Canal/Grupo
            </label>
            <Input
              value={channelConfig.channelId}
              onChange={(e) =>
                setChannelConfig({ ...channelConfig, channelId: e.target.value })
              }
              placeholder="-1001234567890"
            />
            <p className="mt-2 text-xs text-gray-400">
              Para obter o ID do canal:
              <br />
              1. Adicione o bot @userinfobot no seu grupo
              <br />
              2. Ele mostrará o ID (um número negativo, ex: -1001234567890)
              <br />
              3. Copie e cole aqui
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tipo do Canal
            </label>
            <select
              value={channelConfig.channelType}
              onChange={(e) =>
                setChannelConfig({
                  ...channelConfig,
                  channelType: e.target.value as 'private' | 'public',
                })
              }
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="private">Privado (Recomendado)</option>
              <option value="public">Público</option>
            </select>
          </div>

          <div className="rounded-lg bg-yellow-600/20 p-3">
            <p className="text-sm text-yellow-400">
              ⚠️ Certifique-se de que o bot é administrador do grupo/canal antes
              de configurar o ID.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-600/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsConfigModalOpen(false)
                setSelectedChannel(null)
                setChannelConfig({ channelId: '', channelType: 'private' })
                setError('')
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}



