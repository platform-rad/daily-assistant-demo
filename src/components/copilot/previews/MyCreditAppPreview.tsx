import { Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function MyCreditAppPreview() {
  const facilities = [
    {
      id: '1',
      client: 'TechCorp France',
      name: 'Revolving Credit',
      amount: '€10.0M',
      used: '€2.5M',
      status: 'Actif',
      maturity: '2025-09-03',
    },
    {
      id: '2',
      client: 'Manufacturing Inc',
      name: 'Term Loan A',
      amount: '€15.0M',
      used: '€15.0M',
      status: 'Fully Drawn',
      maturity: '2027-12-31',
    },
    {
      id: '3',
      client: 'Retail Group EMEA',
      name: 'Acquisition Facility',
      amount: '€8.2M',
      used: '€5.0M',
      status: 'Actif',
      maturity: '2024-12-15',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Facilities de Crédit</h3>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-2">Exposition Totale</p>
            <p className="text-2xl font-bold text-gray-900">€33.2M</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-2">Utilisée</p>
            <p className="text-2xl font-bold text-blue-600">€22.5M</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-2">Disponible</p>
            <p className="text-2xl font-bold text-green-600">€10.7M</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-2">Taux Util.</p>
            <p className="text-2xl font-bold text-orange-600">67.8%</p>
          </Card>
        </div>

        {/* Add Facility */}
        <div className="mb-6">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 gap-2">
            <Plus size={16} />
            Ajouter une facility
          </Button>
        </div>

        {/* Facilities Table */}
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Client</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Montant</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Utilisée</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Maturité</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{facility.client}</td>
                  <td className="px-6 py-4 text-gray-600">{facility.name}</td>
                  <td className="px-6 py-4 text-right font-semibold">{facility.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: facility.id === '2' ? '100%' : facility.id === '3' ? '61%' : '25%',
                          }}
                        />
                      </div>
                      <span className="font-semibold text-sm">{facility.used}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        facility.status === 'Fully Drawn'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {facility.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">{facility.maturity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Risk Alerts */}
      <Card className="p-6 border-orange-200 bg-orange-50">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-orange-900 mb-2">Alertes de Risque</h4>
            <ul className="space-y-1 text-sm text-orange-800">
              <li>• Retail Group EMEA: Maturité dans 103 jours</li>
              <li>• Manufacturing Inc: Facility fully drawn</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
