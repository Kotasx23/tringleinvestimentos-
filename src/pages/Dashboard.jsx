import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Wallet, 
  DollarSign, 
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import { Modal } from '../components/Modal'
import { PaymentCheckout } from '../components/PaymentCheckout'

export const Dashboard = () => {
  const [stats, setStats] = useState({
    balance: 0,
    totalInvested: 0,
    totalProfit: 0,
    activeInvestments: 0
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [chartData, setChartData] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { error } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Aqui você carregaria os dados do Supabase
      // Por enquanto, usando dados mockados
      setStats({
        balance: 1250.50,
        totalInvested: 5000.00,
        totalProfit: 750.25,
        activeInvestments: 3
      })

      setRecentTransactions([
        { id: 1, type: 'deposit', amount: 500, description: 'Depósito PIX', date: '2024-01-15', status: 'completed' },
        { id: 2, type: 'profit', amount: 125.50, description: 'Rendimento investimento', date: '2024-01-14', status: 'completed' },
        { id: 3, type: 'investment', amount: -1000, description: 'Novo investimento', date: '2024-01-13', status: 'completed' }
      ])

      setChartData([
        { name: 'Jan', value: 4000 },
        { name: 'Fev', value: 4200 },
        { name: 'Mar', value: 4500 },
        { name: 'Abr', value: 4800 },
        { name: 'Mai', value: 5200 },
        { name: 'Jun', value: 5750 }
      ])
    } catch (err) {
      error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentModal(false)
    loadDashboardData() // Recarregar dados
  }

  const StatCard = ({ title, value, icon: Icon, change, changeType = 'up' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {typeof value === 'number' ? value.toFixed(2) : value}
          </p>
          {change && (
            <div className="flex items-center mt-1">
              {changeType === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bem-vindo de volta, {user?.user_metadata?.name || user?.email}
          </p>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Fazer depósito
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo atual"
          value={stats.balance}
          icon={Wallet}
          change="+12.5%"
          changeType="up"
        />
        <StatCard
          title="Total investido"
          value={stats.totalInvested}
          icon={TrendingUp}
          change="+8.2%"
          changeType="up"
        />
        <StatCard
          title="Lucro total"
          value={stats.totalProfit}
          icon={DollarSign}
          change="+15.3%"
          changeType="up"
        />
        <StatCard
          title="Investimentos ativos"
          value={stats.activeInvestments}
          icon={Users}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Evolução do patrimônio
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Patrimônio']}
                labelFormatter={(label) => `${label} 2024`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição de investimentos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Renda Fixa', value: 60, color: '#3b82f6' },
                  { name: 'Ações', value: 25, color: '#10b981' },
                  { name: 'Criptomoedas', value: 15, color: '#f59e0b' }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {[
                  { name: 'Renda Fixa', value: 60, color: '#3b82f6' },
                  { name: 'Ações', value: 25, color: '#10b981' },
                  { name: 'Criptomoedas', value: 15, color: '#f59e0b' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Distribuição']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transações recentes
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      transaction.amount > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Fazer depósito"
        size="md"
      >
        <PaymentCheckout
          amount={100}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />
      </Modal>
    </div>
  )
}