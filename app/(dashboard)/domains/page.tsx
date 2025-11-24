'use client'

import { useEffect, useState } from 'react'
import { domainsApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Trash2, Edit } from 'lucide-react'

export default function DomainsPage() {
  const [domains, setDomains] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      const data = await domainsApi.list()
      setDomains(data)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleCreate = async () => {
    if (!newDomain.trim()) {
      setError('URL é obrigatória')
      return
    }

    setLoading(true)
    setError('')

    try {
      await domainsApi.create(newDomain.trim())
      setNewDomain('')
      setIsModalOpen(false)
      await loadDomains()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este domínio?')) return

    try {
      await domainsApi.delete(id)
      await loadDomains()
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Domínios</h1>
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
                URL
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {domains.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                  Nenhum domínio cadastrado
                </td>
              </tr>
            ) : (
              domains.map((domain) => (
                <tr key={domain.id} className="border-b border-gray-800">
                  <td className="px-4 py-3 text-white">{domain.url}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(domain.id)}
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
          setNewDomain('')
          setError('')
        }}
        title="Novo domínio"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              URL do Domínio
            </label>
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="www.track4you.app"
            />
            <p className="mt-2 text-xs text-gray-400">
              Não inclua https://, //, ou slugs. Digite apenas o domínio - ex: www.track4you.app
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
                setNewDomain('')
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



