import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  BarChart3, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  const isAdmin = user?.user_metadata?.role === 'admin'

  const userMenuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/investments', icon: TrendingUp, label: 'Investimentos' },
    { path: '/wallet', icon: Wallet, label: 'Carteira' },
    { path: '/payments', icon: CreditCard, label: 'Pagamentos' },
    { path: '/transactions', icon: BarChart3, label: 'Transações' },
  ]

  const adminMenuItems = [
    { path: '/admin', icon: Home, label: 'Admin Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Usuários' },
    { path: '/admin/investments', icon: TrendingUp, label: 'Investimentos' },
    { path: '/admin/payments', icon: CreditCard, label: 'Pagamentos' },
    { path: '/admin/settings', icon: Settings, label: 'Configurações' },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  const NavItem = ({ item }) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path

    return (
      <Link
        to={item.path}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isAdmin ? 'Administrador' : 'Usuário'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}