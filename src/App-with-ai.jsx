/**
 * EJEMPLO DE INTEGRACIÓN DE IA - App.jsx con Claude AI
 * 
 * Este archivo muestra cómo integrar todas las funcionalidades de IA
 * en tu aplicación existente.
 * 
 * PASOS PARA INTEGRAR:
 * 1. Copia los imports necesarios
 * 2. Agrega el hook useAIInsights
 * 3. Integra los componentes donde los necesites
 * 4. Asegúrate de tener VITE_ANTHROPIC_API_KEY en .env
 */

import { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTransactions } from './hooks/useTransactions';

// ============================================
// ✅ PASO 1: IMPORTAR COMPONENTES Y HOOKS DE IA
// ============================================
import { useAIInsights } from './hooks/useAIInsights';
import { 
  AIInsightsPanel, 
  SmartCategorySelector, 
  PredictiveChart, 
  AIAlerts 
} from './components/AI';

// Imports existentes
import { TransactionForm } from './components/Transactions/TransactionForm';
import { TransactionList } from './components/Transactions/TransactionList';
import { BalanceCard } from './components/Dashboard/BalanceCard';
import { CategoryChart } from './components/Dashboard/CategoryChart';
import { Alert } from './components/Shared/Alert';
import { ProfileMenu } from './components/Auth/ProfileMenu';
import MigrationDialog from './components/MigrationDialog';
import AuthPage from './pages/AuthPage';
import { hasPendingMigration } from './utils/dataMigration';
import { BalanceDonutChart } from './components/Charts/BalanceDonutChart';
import { TrendLineChart } from './components/Charts/TrendLineChart';
import { CategoryBarChart } from './components/Charts/CategoryBarChart';
import { ComparativeChart } from './components/Charts/ComparativeChart';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [showMigration, setShowMigration] = useState(false);

  const {
    incomes,
    expenses,
    alert,
    addIncome,
    addExpense,
    removeIncome,
    removeExpense,
    showAlert,
    totalIncome,
    totalExpenses,
    balance,
    categoryAnalysis,
  } = useTransactions();

  // ============================================
  // ✅ PASO 2: INICIALIZAR HOOK DE IA
  // ============================================
  // Combinar todas las transacciones para análisis
  const allTransactions = useMemo(() => {
    return [
      ...incomes.map(t => ({ ...t, type: 'income' })),
      ...expenses.map(t => ({ ...t, type: 'expense' }))
    ];
  }, [incomes, expenses]);

  const {
    // Análisis financiero
    analysis,
    analyzing,
    analysisError,
    runAnalysis,
    
    // Predicciones
    predictions,
    predicting,
    predictExpenses,
    
    // Alertas
    alerts,
    alertsLoading,
    checkAnomalies,
  } = useAIInsights(allTransactions);

  // ============================================
  // ✅ PASO 3: PREPARAR DATOS PARA PREDICCIONES
  // ============================================
  // Agrupar transacciones por mes para predicciones
  const monthlyData = useMemo(() => {
    const months = {};
    
    allTransactions.forEach(t => {
      if (t.type === 'expense') {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!months[monthKey]) {
          months[monthKey] = {
            month: new Date(t.date).toLocaleDateString('es-PA', { month: 'short', year: 'numeric' }),
            total: 0
          };
        }
        
        months[monthKey].total += t.amount;
      }
    });
    
    // Convertir a array y ordenar
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [allTransactions]);

  // Auto-generar predicciones cuando hay suficientes datos
  useEffect(() => {
    if (monthlyData.length >= 2 && !predictions && !predicting) {
      predictExpenses(monthlyData);
    }
  }, [monthlyData, predictions, predicting, predictExpenses]);

  // Verificar migración pendiente
  useEffect(() => {
    if (user && hasPendingMigration()) {
      setShowMigration(true);
    }
  }, [user]);

  if (!user && !authLoading) {
    return <AuthPage />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 md:p-8">
      {/* Diálogo de migración */}
      {showMigration && (
        <MigrationDialog
          onClose={() => setShowMigration(false)}
          onComplete={(count) => {
            showAlert(`${count} transacciones migradas exitosamente`, 'success');
            setShowMigration(false);
            window.location.reload();
          }}
        />
      )}

      {/* Alert global */}
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message}
          onClose={() => showAlert(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* ============================================ */}
        {/* ✅ PASO 4: HEADER CON ALERTAS DE IA */}
        {/* ============================================ */}
        <header className="bg-gradient-dark text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex-1 text-center">
              <h1 className="text-4xl md:text-5xl font-light mb-3">
                Calculadora de Presupuesto Personal
              </h1>
              <p className="text-lg opacity-90">
                Gestiona tus finanzas personales de manera inteligente 🤖
              </p>
            </div>
            
            {/* Botones del header */}
            <div className="ml-4 flex items-center gap-3">
              {/* ✨ NUEVO: Alertas inteligentes */}
              <AIAlerts
                alerts={alerts}
                loading={alertsLoading}
                onRefresh={checkAnomalies}
              />
              
              <ProfileMenu />
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Formularios de entrada */}
          <TransactionForm 
            onAddIncome={addIncome}
            onAddExpense={addExpense}
          />

          {/* Card de balance */}
          <BalanceCard
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
          />

          {/* ============================================ */}
          {/* ✅ PASO 5: PANEL DE INSIGHTS DE IA */}
          {/* ============================================ */}
          {/* 🆕 Análisis Financiero Inteligente */}
          <div className="my-8">
            <AIInsightsPanel
              analysis={analysis}
              analyzing={analyzing}
              error={analysisError}
              onAnalyze={() => runAnalysis({ 
                totalIncome, 
                totalExpenses, 
                balance 
              })}
              monthlyTotals={{
                income: totalIncome,
                expenses: totalExpenses,
                balance
              }}
            />
          </div>

          {/* Gráficos existentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BalanceDonutChart
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
            <CategoryChart categoryAnalysis={categoryAnalysis} />
          </div>

          {/* ============================================ */}
          {/* ✅ PASO 6: GRÁFICO PREDICTIVO */}
          {/* ============================================ */}
          {/* 🆕 Predicciones de Gastos Futuros */}
          {monthlyData.length >= 2 && (
            <div className="my-8">
              <PredictiveChart
                historicalData={monthlyData}
                predictions={predictions}
                loading={predicting}
              />
            </div>
          )}

          {/* Gráfico de tendencias */}
          <TrendLineChart
            incomes={incomes}
            expenses={expenses}
            days={30}
          />

          {/* Gráficos de barras y comparativa */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CategoryBarChart
              categoryAnalysis={categoryAnalysis}
              topN={5}
            />
            <ComparativeChart
              incomes={incomes}
              expenses={expenses}
            />
          </div>

          {/* Listas de transacciones */}
          <TransactionList
            incomes={incomes}
            expenses={expenses}
            onRemoveIncome={removeIncome}
            onRemoveExpense={removeExpense}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/80 text-sm">
          <p>© 2025 Budget Calculator | Desarrollado con React + Vite + TailwindCSS + Claude AI 🤖</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

// ============================================
// 📝 NOTAS DE IMPLEMENTACIÓN
// ============================================

/**
 * INTEGRACIÓN DEL CATEGORIZADOR INTELIGENTE EN FORMULARIO:
 * 
 * Para usar SmartCategorySelector en TransactionForm.jsx:
 * 
 * 1. Importar en TransactionForm:
 * ```jsx
 * import { SmartCategorySelector } from '../AI';
 * import { useAIInsights } from '../../hooks/useAIInsights';
 * ```
 * 
 * 2. Inicializar hook:
 * ```jsx
 * const { suggestedCategory, categorizing, getCategorySuggestion } = useAIInsights();
 * ```
 * 
 * 3. Reemplazar el select de categoría:
 * ```jsx
 * <SmartCategorySelector
 *   description={expenseDescription}
 *   selectedCategory={expenseCategory}
 *   categories={EXPENSE_CATEGORIES.map(c => c.value)}
 *   onCategoryChange={setExpenseCategory}
 *   onGetSuggestion={getCategorySuggestion}
 *   suggestedCategory={suggestedCategory}
 *   loading={categorizing}
 * />
 * ```
 */

/**
 * COSTOS ESTIMADOS POR MES:
 * 
 * Basado en uso típico de un usuario:
 * - 4 análisis mensuales: $0.040
 * - 30 categorizaciones: $0.003
 * - 1 predicción mensual: $0.008
 * - 4 análisis de alertas: $0.020
 * 
 * TOTAL: ~$0.071/mes por usuario
 * 
 * Con caché y rate limiting, costo puede reducirse 50-70%
 */

/**
 * VERIFICACIÓN DE CONFIGURACIÓN:
 * 
 * 1. Asegúrate de tener en .env:
 *    VITE_ANTHROPIC_API_KEY=sk-ant-api03-tu-clave-aqui
 * 
 * 2. Reinicia el servidor:
 *    npm run dev
 * 
 * 3. Abre consola del navegador y verifica que no hay errores de API Key
 * 
 * 4. Intenta hacer un análisis desde el panel de IA
 */
