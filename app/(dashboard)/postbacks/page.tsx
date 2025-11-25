'use client'

import { useEffect, useState } from 'react'
import { postbacksApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Trash2, Edit, TestTube, FileText, MousePointer, UserPlus, UserMinus } from 'lucide-react'

const postbackTypes = [
  { value: 'ViewPage', label: 'ViewPage', icon: FileText },
  { value: 'ClickButton', label: 'Clique no Botão', icon: MousePointer },
  { value: 'EnterChannel', label: 'Entrada no Canal', icon: UserPlus },
  { value: 'ExitChannel', label: 'Saída do Canal', icon: UserMinus },
]

export default function PostbacksPage() {
  const [postbacks, setPostbacks] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [testing, setTesting] = useState<string | null>(null)

  useEffect(() => {
    loadPostbacks()
  }, [])

  const loadPostbacks = async () => {
    try {
      const data = await postbacksApi.list()
      setPostbacks(data)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.url || !formData.type) {
      setError('Todos os campos são obrigatórios')
      return
    }

    setLoading(true)
    setError('')

    try {
      await postbacksApi.create(formData)
      setFormData({ name: '', url: '', type: '' })
      setSelectedType('')
      setIsModalOpen(false)
      await loadPostbacks()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este postback?')) return

    try {
      await postbacksApi.delete(id)
      await loadPostbacks()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleTest = async (id: string) => {
    setTesting(id)
    try {
      const result = await postbacksApi.test(id)
      if (result.success) {
        alert(`✅ Postback testado com sucesso!\nStatus: ${result.status || 'OK'}\n${result.message || ''}`)
      } else {
        // Mesmo que não seja "success", pode ser que a requisição foi enviada corretamente
        // mas o servidor retornou um status diferente (ex: 404, 500)
        const message = result.message || result.error || 'Erro desconhecido'
        alert(`⚠️ Resposta do servidor:\nStatus: ${result.status || 'N/A'}\n${message}`)
      }
    } catch (error: any) {
      // Erro de rede ou timeout
      alert(`❌ Erro ao testar postback:\n${error.message || 'Erro desconhecido'}`)
    } finally {
      setTesting(null)
    }
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setFormData({ ...formData, type })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Postbacks</h1>
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
                URL
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                TIPO
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {postbacks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Nenhum postback cadastrado
                </td>
              </tr>
            ) : (
              postbacks.map((postback) => {
                const typeInfo = postbackTypes.find((t) => t.value === postback.type)
                return (
                  <tr key={postback.id} className="border-b border-gray-800">
                    <td className="px-4 py-3 text-white">{postback.name}</td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-400">
                      {postback.url.length > 50
                        ? `${postback.url.substring(0, 50)}...`
                        : postback.url}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {typeInfo && <typeInfo.icon size={16} className="text-gray-400" />}
                        <span className="text-white">{typeInfo?.label || postback.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleTest(postback.id)}
                          disabled={testing === postback.id}
                        >
                          <TestTube size={16} className="mr-1" />
                          {testing === postback.id ? 'Testando...' : 'Testar Postback'}
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
                          onClick={() => handleDelete(postback.id)}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Deletar
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ name: '', url: '', type: '' })
          setSelectedType('')
          setError('')
        }}
        title="Novo Postback"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <p className="mb-4 text-sm font-medium text-gray-300">
              Escolha o evento do Postback
            </p>
            <div className="grid grid-cols-2 gap-3">
              {postbackTypes.map((type) => {
                const Icon = type.icon
                const isSelected = selectedType === type.value
                return (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSelect(type.value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Icon
                      size={24}
                      className={isSelected ? 'text-primary' : 'text-gray-400'}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {type.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedType && (
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
                  placeholder="Digite o Nome do Postback"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  URL
                </label>
                <Input
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="www.exemplo.com"
                />
              </div>
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
                setFormData({ name: '', url: '', type: '' })
                setSelectedType('')
                setError('')
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={loading || !selectedType}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}



