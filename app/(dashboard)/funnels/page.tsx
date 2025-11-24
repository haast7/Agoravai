'use client'

import { useEffect, useState } from 'react'
import { funnelsApi, pixelsApi, domainsApi, channelsApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { Trash2, BookOpen, Copy, Check } from 'lucide-react'

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<any[]>([])
  const [pixels, setPixels] = useState<any[]>([])
  const [domains, setDomains] = useState<any[]>([])
  const [channels, setChannels] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [instructionsModal, setInstructionsModal] = useState<string | null>(null)
  const [instructions, setInstructions] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    pixelId: '',
    domainId: '',
    channelId: '',
    requestEntry: false,
    urls: [] as string[],
  })
  const [newUrl, setNewUrl] = useState('')
  const [selectedDomain, setSelectedDomain] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [funnelsData, pixelsData, domainsData, channelsData] = await Promise.all([
        funnelsApi.list(),
        pixelsApi.list(),
        domainsApi.list(),
        channelsApi.list(),
      ])
      setFunnels(funnelsData)
      setPixels(pixelsData)
      setDomains(domainsData)
      setChannels(channelsData)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleCreate = async () => {
    // Limpar erro anterior
    setError('')

    // Validar campos obrigatórios
    if (!formData.name?.trim()) {
      setError('Nome do funil é obrigatório')
      return
    }

    if (!formData.pixelId) {
      setError('Selecione um Pixel')
      return
    }

    if (!formData.domainId) {
      setError('Selecione um Domínio')
      return
    }

    if (!formData.channelId) {
      setError('Selecione um Canal')
      return
    }

    // Validar URLs - pelo menos 1 é obrigatório
    if (!formData.urls || formData.urls.length === 0) {
      setError('Adicione pelo menos uma URL')
      return
    }

    // Validar que as URLs não estão vazias
    const validUrls = formData.urls.filter((url) => url.trim().length > 0)
    if (validUrls.length === 0) {
      setError('Adicione pelo menos uma URL válida')
      return
    }

    setLoading(true)
    setError('')

    try {
      await funnelsApi.create({
        ...formData,
        urls: validUrls, // Enviar apenas URLs válidas
      })
      setFormData({
        name: '',
        pixelId: '',
        domainId: '',
        channelId: '',
        requestEntry: false,
        urls: [],
      })
      setNewUrl('')
      setSelectedDomain(null)
      setIsModalOpen(false)
      await loadData()
    } catch (error: any) {
      setError(error.message || 'Erro ao criar funil')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este funil?')) return

    try {
      await funnelsApi.delete(id)
      await loadData()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleShowInstructions = async (id: string) => {
    try {
      const data = await funnelsApi.getInstructions(id)
      setInstructions(data)
      setInstructionsModal(id)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleAddUrl = () => {
    if (!newUrl.trim()) return
    if (formData.urls.length >= 5) {
      setError('Máximo de 5 URLs permitidas')
      return
    }
    setFormData({
      ...formData,
      urls: [...formData.urls, newUrl.trim()],
    })
    setNewUrl('')
  }

  const handleRemoveUrl = (index: number) => {
    setFormData({
      ...formData,
      urls: formData.urls.filter((_, i) => i !== index),
    })
  }

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDomainChange = (domainId: string) => {
    const domain = domains.find((d) => d.id === domainId)
    setSelectedDomain(domain)
    setFormData({ ...formData, domainId, urls: [] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Funis</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Novo</Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-600/20 p-4 text-red-400">{error}</div>
      )}

      <Card>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                NOME DO FUNIL
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                DOMÍNIO
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                URLS
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {funnels.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Nenhum funil cadastrado
                </td>
              </tr>
            ) : (
              funnels.map((funnel) => (
                <tr key={funnel.id} className="border-b border-gray-800">
                  <td className="px-4 py-3 text-white">{funnel.name}</td>
                  <td className="px-4 py-3 text-white">{funnel.domain?.url}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {funnel.urls.length} URL(s)
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleShowInstructions(funnel.id)}
                      >
                        <BookOpen size={16} className="mr-1" />
                        Tutorial
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(funnel.id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Deletar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Modal de Novo Funil */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({
            name: '',
            pixelId: '',
            domainId: '',
            channelId: '',
            requestEntry: false,
            urls: [],
          })
          setNewUrl('')
          setSelectedDomain(null)
          setError('')
        }}
        title="Novo Funil"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Nome
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Digite o Nome do Funil"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Pixel
            </label>
            <Select
              value={formData.pixelId}
              onChange={(e) =>
                setFormData({ ...formData, pixelId: e.target.value })
              }
            >
              <option value="">Selecione um Pixel</option>
              {pixels.map((pixel) => (
                <option key={pixel.id} value={pixel.id}>
                  {pixel.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Domínio
            </label>
            <Select
              value={formData.domainId}
              onChange={(e) => handleDomainChange(e.target.value)}
            >
              <option value="">Selecione o Domínio</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.url}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Canal
            </label>
            <Select
              value={formData.channelId}
              onChange={(e) =>
                setFormData({ ...formData, channelId: e.target.value })
              }
            >
              <option value="">Selecione o Canal</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requestEntry"
              checked={formData.requestEntry}
              onChange={(e) =>
                setFormData({ ...formData, requestEntry: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-600 bg-gray-800"
            />
            <label htmlFor="requestEntry" className="text-sm text-gray-300">
              Ativar Solicitação de Entrada
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Adicionar URLs (máximo 5)
            </label>
            <div className="flex gap-2">
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={
                  selectedDomain
                    ? `Ex: /pagina1 ou pagina2`
                    : 'Selecione um domínio primeiro'
                }
                disabled={!selectedDomain}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddUrl()
                  }
                }}
              />
              <Button
                onClick={handleAddUrl}
                disabled={!selectedDomain || formData.urls.length >= 5}
              >
                Adicionar
              </Button>
            </div>
            {formData.urls.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.urls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-gray-800 p-2"
                  >
                    <span className="text-sm text-white">
                      {selectedDomain?.url}
                      {url.startsWith('/') ? '' : '/'}
                      {url}
                    </span>
                    <button
                      onClick={() => handleRemoveUrl(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-red-600/20 p-3">
            <p className="text-sm text-red-400">
              ⚠️ Este bloco não poderá ser alterado.
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
                setIsModalOpen(false)
                setFormData({
                  name: '',
                  pixelId: '',
                  domainId: '',
                  channelId: '',
                  requestEntry: false,
                  urls: [],
                })
                setNewUrl('')
                setSelectedDomain(null)
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

      {/* Modal de Instruções */}
      {instructionsModal && instructions && (
        <Modal
          isOpen={!!instructionsModal}
          onClose={() => {
            setInstructionsModal(null)
            setInstructions(null)
          }}
          title="Instruções de Configuração"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm text-gray-300">
                Adicione esse código ao Head do seu site:
              </p>
              <div className="flex gap-2">
                <Input value={instructions.script} readOnly className="font-mono text-sm" />
                <Button
                  onClick={() => copyToClipboard(instructions.script, 'script')}
                  variant="secondary"
                >
                  {copied === 'script' ? (
                    <Check size={16} className="mr-1" />
                  ) : (
                    <Copy size={16} className="mr-1" />
                  )}
                  Copiar
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-300">
                Utilize esse link para entrada no seu Grupo do Telegram:
              </p>
              <div className="flex gap-2">
                <Input value={instructions.telegramLink} readOnly className="font-mono text-sm" />
                <Button
                  onClick={() => copyToClipboard(instructions.telegramLink, 'link')}
                  variant="secondary"
                >
                  {copied === 'link' ? (
                    <Check size={16} className="mr-1" />
                  ) : (
                    <Copy size={16} className="mr-1" />
                  )}
                  Copiar
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-red-600/20 p-4">
              <p className="text-sm text-red-400">
                ⚠️ Siga às instruções com atenção. Apenas entradas em páginas com
                o código configurado no head e feitas através do link correto serão
                contabilizadas.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setInstructionsModal(null)
                  setInstructions(null)
                }}
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}



