import { useState, useEffect } from 'react'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import { Modal } from '../components/Modal'

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    totalRevenue: 0,
    pendingPayments: 0
  })
  const [users, setUsers] = useState([])
  const [investments, setInvestments] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const { user } = useAuth()
  const { error, success } = useToast()

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Dados mockados para demonstração
      setStats({
        totalUsers: 156,
        totalInvestments: 89,
        totalRevenue: 125000.50,
        pendingPayments: 12
      })

      setUsers([
        { id: 1, name: 'João Silva', email: 'joao@email.com', balance: 2500, status: 'active', created_at: '2024-01-10' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', balance: 1800, status: 'active', created_at: '2024-01-12' },
        { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', balance: 0, status: 'inactive', created_at: '2024-01-15' }
      ])

      setInvestments([
        { id: 1, user: 'João Silva', type: 'Renda Fixa', amount: 1000, return: 8.5, status: 'active' },
        { id: 2, user: 'Maria Santos', type: 'Ações', amount: 1500, return: 12.3, status: 'active' },
        { id: 3, user: 'Pedro Costa', type: 'Criptomoedas', amount: 500, return: -5.2, status: 'paused' }
      ])

      setPayments([
        { id: 1, user: 'João Silva', amount: 500, method: 'PIX', status: 'approved', date: '2024-01-15' },
        { id: 2, user: 'Maria Santos', amount: 1000, method: 'PIX', status: 'pending', date: '2024-01-16' },
        { id: 3, user: 'Pedro Costa', amount: 300, method: 'PIX', status: 'rejected', date: '2024-01-17' }
      ])
    } catch (err) {
      error('Erro ao carregar dados administrativos')
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        // Aqui você faria a exclusão no Supabase
        success('Usuário excluído com sucesso')
        loadAdminData()
      } catch (err) {
        error('Erro ao excluir usuário')
      }
    }
  }

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' && title.includes('Revenue') ? `R$ ${value.toFixed(2)}` : value}
          </p>
        </div>
        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
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
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie usuários, investimentos e pagamentos
          </p>
        </div>
        <button className="btn-primary flex items-center mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Novo usuário
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de usuários"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Investimentos ativos"
          value={stats.totalInvestments}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Receita total"
          value={stats.totalRevenue}
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="Pagamentos pendentes"
          value={stats.pendingPayments}
          icon={CreditCard}
          color="red"
        />
      </div>

      {/* Users Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Usuários
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data de registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    R$ {user.balance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Pagamentos recentes
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {payment.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    R$ {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'approved' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                    }`}>
                      {payment.status === 'approved' ? 'Aprovado' : 
                       payment.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payment.date).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Edit Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Editar usuário"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
              </label>
              <input
                type="text"
                defaultValue={selectedUser.name}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                defaultValue={selectedUser.email}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Saldo
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue={selectedUser.balance}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select defaultValue={selectedUser.status} className="input-field mt-1">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button className="btn-primary flex-1">
                Salvar alterações
              </button>
              <button 
                onClick={() => setShowUserModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}