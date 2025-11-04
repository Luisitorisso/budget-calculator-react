import { supabase } from '../lib/supabase'

const LOCALSTORAGE_KEY = 'budgetCalculator_transactions'
const MIGRATION_STATUS_KEY = 'budgetCalculator_migrationStatus'

export const migrationUtils = {
  // Verificar si hay datos en localStorage
  hasLocalData() {
    const data = localStorage.getItem(LOCALSTORAGE_KEY)
    return data && JSON.parse(data).length > 0
  },

  // Obtener datos de localStorage
  getLocalData() {
    try {
      const data = localStorage.getItem(LOCALSTORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error al leer localStorage:', error)
      return []
    }
  },

  // Verificar si ya se migró
  isMigrated() {
    return localStorage.getItem(MIGRATION_STATUS_KEY) === 'completed'
  },

  // Marcar migración como completada
  markAsMigrated() {
    localStorage.setItem(MIGRATION_STATUS_KEY, 'completed')
  },

  // Migrar datos de localStorage a Supabase
  async migrateToSupabase(userId) {
    if (!userId) {
      throw new Error('Se requiere un ID de usuario')
    }

    if (this.isMigrated()) {
      return { success: true, message: 'Ya se migró previamente', count: 0 }
    }

    const localTransactions = this.getLocalData()

    if (localTransactions.length === 0) {
      this.markAsMigrated()
      return { success: true, message: 'No hay datos para migrar', count: 0 }
    }

    try {
      // Transformar datos al formato de Supabase
      const transactionsToInsert = localTransactions.map(t => ({
        user_id: userId,
        description: t.description,
        amount: t.amount,
        category: t.category || null,
        type: t.type,
        date: t.date || new Date().toISOString().split('T')[0]
      }))

      // Insertar en lotes de 50 para evitar timeouts
      const batchSize = 50
      let successCount = 0

      for (let i = 0; i < transactionsToInsert.length; i += batchSize) {
        const batch = transactionsToInsert.slice(i, i + batchSize)
        const { error } = await supabase
          .from('transactions')
          .insert(batch)

        if (error) throw error
        successCount += batch.length
      }

      // Marcar como migrado
      this.markAsMigrated()

      // Opcional: Hacer backup en localStorage antes de limpiar
      localStorage.setItem(
        'budgetCalculator_backup',
        localStorage.getItem(LOCALSTORAGE_KEY)
      )

      return {
        success: true,
        message: `Se migraron ${successCount} transacciones exitosamente`,
        count: successCount
      }
    } catch (error) {
      console.error('Error al migrar datos:', error)
      return {
        success: false,
        message: error.message,
        count: 0
      }
    }
  },

  // Limpiar datos locales (usar con precaución)
  clearLocalData() {
    localStorage.removeItem(LOCALSTORAGE_KEY)
    localStorage.removeItem(MIGRATION_STATUS_KEY)
  },

  // Restaurar desde backup
  async restoreFromBackup() {
    const backup = localStorage.getItem('budgetCalculator_backup')
    if (backup) {
      localStorage.setItem(LOCALSTORAGE_KEY, backup)
      localStorage.removeItem(MIGRATION_STATUS_KEY)
      return true
    }
    return false
  }
}
