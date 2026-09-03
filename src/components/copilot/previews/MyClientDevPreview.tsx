import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function MyClientDevPreview() {
  const clients = [
    {
      id: '1',
      name: 'TechCorp France',
      status: 'Nouveau',
      created: '2024-09-03',
      exposure: '€10.0M',
    },
    {
      id: '2',
      name: 'Manufacturing Inc',
      status: 'Actif',
      created: '2024-08-15',
      exposure: '€25.5M',
    },
    {
      id: '3',
      name: 'Retail Group EMEA',
      status: 'Actif',
      created: '2024-07-20',
      exposure: '€18.2M',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Portefeuille Clients</h3>

        {/* Search & Actions */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Chercher un client..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 gap-2">
            <Plus size={16} />
            Nouveau client
          </Button>
        </div>

        {/* Clients Table */}
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Créé</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Exposition</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        client.status === 'Nouveau'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.created}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{client.exposure}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Client Details Panel */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-bold mb-4">Informations Générales</h4>
          <div className="space-y-3 text-sm">
            <div>
              <label className="text-gray-600">Nom</label>
              <input
                type="text"
                defaultValue="TechCorp France"
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="text-gray-600">Type</label>
              <input
                type="text"
                defaultValue="Corporate"
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="text-gray-600">Secteur</label>
              <input
                type="text"
                defaultValue="Technology"
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
                disabled
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-bold mb-4">Statistiques</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Exposure totale</span>
              <span className="font-semibold">€10.0M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre de facilities</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rating</span>
              <span className="font-semibold">BBB+</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
