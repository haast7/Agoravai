'use client'

import { useEffect, useState } from 'react'
import { pixelsApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Trash2, Edit, TestTube } from 'lucide-react'

export default function PixelsPage() {
  const [pixels, setPixels] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    pixelId: '',
    accessToken: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPixels()
  }, [])

  const loadPixels = async () => {
    try {
      const data = await pixelsApi.list()
      setPixels(data)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.pixelId || !formData.accessToken) {
      setError('Todos os campos são obrigatórios')
      return
    }

    setLoading(true)
    setError('')

    try {
      await pixelsApi.create(formData.name, formData.pixelId, formData.accessToken)
      setFormData({ name: '', pixelId: '', accessToken: '' })
      setIsModalOpen(false)
      await loadPixels()
    } catch (error: any) {
      // Tentar extrair mensagem de erro mais detalhada
      let errorMessage = error.message || 'Erro ao criar pixel'
      
      // Se a resposta tiver detalhes, mostrar
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
        if (error.response.data.details) {
          const details = error.response.data.details
          if (details.message) {
            errorMessage = `${errorMessage}: ${details.message}`
          } else if (details.error_subcode) {
            errorMessage = `${errorMessage} (Código: ${details.error_subcode})`
          }
        }
      }
      
      setError(errorMessage)
      console.error('Erro detalhado:', error.response?.data || error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este pixel?')) return

    try {
      await pixelsApi.delete(id)
      await loadPixels()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleTest = async (id: string) => {
    try {
      const result = await pixelsApi.test(id)
      if (result.success) {
        alert('Pixel testado com sucesso!')
      } else {
        alert('Erro ao testar pixel')
      }
    } catch (error: any) {
      alert(`Erro: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Pixels</h1>
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
                NOME
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {pixels.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                  Nenhum pixel cadastrado
                </td>
              </tr>
            ) : (
              pixels.map((pixel) => (
                <tr key={pixel.id} className="border-b border-gray-800">
                  <td className="px-4 py-3 text-white">{pixel.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleTest(pixel.id)}
                      >
                        <TestTube size={16} className="mr-1" />
                        Evento teste
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          // TODO: Implementar edição
                          alert('Edição em breve')
                        }}
                      >
                        <Edit size={16} className="mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(pixel.id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ name: '', pixelId: '', accessToken: '' })
          setError('')
        }}
        title="Novo Pixel"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                1
              </div>
              <span className="font-medium text-white">
                Colete Pixel e Token no Facebook
              </span>
            </div>
            <p className="ml-10 text-sm text-gray-400">
              Localize e copie seu ID e Token de Integração
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                2
              </div>
              <span className="font-medium text-white">
                Preencha o Nome, ID e Token de Integração do Pixel
              </span>
            </div>
            <p className="ml-10 text-sm text-gray-400">
              Preencha corretamente os campos abaixo e verifique as informações
            </p>
          </div>

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
                placeholder="Digite o Nome do Pixel"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                ID
              </label>
              <Input
                value={formData.pixelId}
                onChange={(e) =>
                  setFormData({ ...formData, pixelId: e.target.value })
                }
                placeholder="Digite o ID do Pixel"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Token de Integração
              </label>
              <Input
                value={formData.accessToken}
                onChange={(e) =>
                  setFormData({ ...formData, accessToken: e.target.value })
                }
                placeholder="Digite o Token de Integração do Pixel"
                type="password"
              />
            </div>
          </div>

          <div className="rounded-lg bg-red-600/20 p-4">
            <p className="text-sm text-red-400">
              ⚠️ Se você gerar um novo token de integração no Facebook após
              configurar o pixel, o token atual será invalidado e a automação
              deixará de funcionar
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
                setFormData({ name: '', pixelId: '', accessToken: '' })
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
    </div>
  )
}



