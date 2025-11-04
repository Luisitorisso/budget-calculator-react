import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm'
import { ProfileMenu } from './components/Auth/ProfileMenu'
import { MigrationPrompt } from './components/Migration/MigrationPrompt'
import { useSupabaseTransactions } from './hooks/useSupabaseTransactions'
import { migrationUtils } from './utils/migrationUtils'
import { TransactionForm } from './components/Transactions/TransactionForm'
import { TransactionList } from './components/Transactions/TransactionList'
import { BalanceCard } from './components/Dashboard/BalanceCard'
import { Alert } from './components/Shared/Alert'
import { BalanceDonutChart } from './components/Charts/BalanceDonutChart'
import { TrendLineChart } from './components/Charts/TrendLineChart'
import { CategoryBarChart } from './components/Charts/CategoryBarChart'
import { ComparativeChart } from './components/Charts/ComparativeChart'

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('login')

  const forms = {
    login: <LoginForm onToggleForm={setCurrentForm} />,
    register: <RegisterForm onToggleForm={setCurrentForm} />,
    'forgot-password': <ForgotPasswordForm onToggleForm={setCurrentForm} />
  }

  return forms[currentForm] || forms.login
}

const DashboardContent = () => {
  const { user } = useAuth()
  const {
    transactions,
    loading,
    syncing,
    error,
    addTransaction,
    deleteTransaction
  } = useSupabaseTransactions()

  const [showMigration, setShowMigration] = useState(false)
  const [alert, setAlert] = useState(null)

  // Verificar si hay datos para migrar al primer login
  useEffect(() => {
    if (user && !migrationUtils.isMigrated() && migrationUtils.hasLocalData()) {
      setShowMigration(true)
    }
  }, [user])

  // Calcular totales
  const incomes = transactions.filter(t => t.type === 'income')
  const expenses = transactions.filter(t => t.type === 'expense')
  
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  // Análisis por categorías
  const categoryAnalysis = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Sin categoría'
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0 }
    }
    acc[category].total += expense.amount
    acc[category].count += 1
    return acc
  }, {})

  // Handlers
  const handleAddIncome = async (income) => {
    const { error } = await addTransaction({ ...income, type: 'income' })
    if (error) {
      setAlert({ type: 'error', message: error })
    } else {
      setAlert({ type: 'success', message: 'Ingreso agregado correctamente' })
    }
    setTimeout(() => setAlert(null), 3000)
  }

  const handleAddExpense = async (expense) => {
    const { error } = await addTransaction({ ...expense, type: 'expense' })
    if (error) {
      setAlert({ type: 'error', message: error })
    } else {
      setAlert({ type: 'success', message: 'Gasto agregado correctamente' })
    }
    setTimeout(() => setAlert(null), 3000)
  }

  const handleDelete = async (id, type) => {
    const { error } = await deleteTransaction(id)
    if (error) {
      setAlert({ type: 'error', message: error })
    } else {
      setAlert({ type: 'success', message: `${type === 'income' ? 'Ingreso' : 'Gasto'} eliminado` })
    }
    setTimeout(() => setAlert(null), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando tus datos...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showMigration && (
        <MigrationPrompt onComplete={() => setShowMigration(false)} />
      )}

      <div className="min-h-screen p-5 md:p-8 bg-gray-50">
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {error && (
          <Alert type="error" message={error} />
        )}

        <div className="max-w-7xl mx-auto">
          {/* Header con menú de perfil */}
          <header className="bg-gradient-dark text-white rounded-2xl p-8 mb-8 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-light mb-3">
                  Calculadora de Presupuesto Personal
                </h1>
                <p className="text-lg opacity-90">
                  Gestiona tus finanzas de forma inteligente
                </p>
              </div>
              <div className="bg-white rounded-xl">
                <ProfileMenu />
              </div>
            </div>
            
            {syncing && (
              <div className="flex items-center justify-center space-x-2 text-sm bg-white bg-opacity-20 rounded-lg px-4 py-2 mt-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sincronizando...</span>
              </div>
            )}
          </header>

          {/* Balance Principal */}
          <div className="mb-8">
            <BalanceCard
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              balance={balance}
            />
          </div>

          {/* Gráficos Avanzados */}
          {transactions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="animate-fadeIn">
                <BalanceDonutChart transactions={transactions} />
              </div>
              <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <TrendLineChart transactions={transactions} />
              </div>
              <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <CategoryBarChart transactions={transactions} />
              </div>
              <div className="animate-fadeIn" style={{ animationDelay: '600ms' }}>
                <ComparativeChart transactions={transactions} />
              </div>
            </div>
          )}

          {/* Formularios y Listas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TransactionForm
              title="Ingresos"
              type="income"
              onSubmit={handleAddIncome}
              bgGradient="from-green-400 to-green-600"
            />
            <TransactionForm
              title="Gastos"
              type="expense"
              onSubmit={handleAddExpense}
              bgGradient="from-red-400 to-red-600"
            />
          </div>

          {/* Listas de Transacciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionList
              title="Ingresos"
              transactions={incomes}
              type="income"
              onDelete={(id) => handleDelete(id, 'income')}
            />
            <TransactionList
              title="Gastos"
              transactions={expenses}
              type="expense"
              onDelete={(id) => handleDelete(id, 'expense')}
              categoryAnalysis={categoryAnalysis}
            />
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

function MainApp() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Cargando...</p>
        </div>
      </div>
    )
  }

  return user ? <DashboardContent /> : <AuthPage />
}

export default App
