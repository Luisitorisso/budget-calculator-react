import { supabase } from '../lib/supabase'

/**
 * Migra datos de localStorage a Supabase para un usuario autenticado
 * @returns {Promise<{success: boolean, migratedCount: number, error: any}>}
 */
export async function migrateFromLocalStorage() {
  try {
    // Verificar que el usuario esté autenticado
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return {
        success: false,
        migratedCount: 0,
        error: 'Usuario no autenticado'
      }
    }

    // Obtener datos de localStorage
    const localData = localStorage.getItem('budget-calculator-transactions')
    
    if (!localData) {
      return {
        success: true,
        migratedCount: 0,
        error: null
      }
    }

    const transactions = JSON.parse(localData)
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        success: true,
        migratedCount: 0,
        error: null
      }
    }

    console.log(`Migrando ${transactions.length} transacciones a Supabase...`)

    // Transformar transacciones al formato de Supabase
    const transactionsToInsert = transactions.map(tx => ({
      id: tx.id, // Mantener el mismo ID si existe
      user_id: user.id,
      description: tx.description,
      amount: parseFloat(tx.amount),
      category: tx.category,
      type: tx.type,
      date: tx.date || new Date().toISOString()
    }))

    // Insertar en Supabase (usando upsert para evitar duplicados)
    const { data, error } = await supabase
      .from('transactions')
      .upsert(transactionsToInsert, {
        onConflict: 'id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Error al migrar transacciones:', error)
      return {
        success: false,
        migratedCount: 0,
        error: error.message
      }
    }

    console.log(`Migradas ${transactionsToInsert.length} transacciones exitosamente`)

    // Hacer backup del localStorage antes de limpiar
    const backupKey = `budget-calculator-backup-${new Date().getTime()}`
    localStorage.setItem(backupKey, localData)

    // Limpiar localStorage (opcional, comentado por seguridad)
    // localStorage.removeItem('budget-calculator-transactions')
    
    // Marcar la migración como completada
    localStorage.setItem('budget-calculator-migrated', 'true')

    return {
      success: true,
      migratedCount: transactionsToInsert.length,
      error: null
    }

  } catch (error) {
    console.error('Error durante la migración:', error)
    return {
      success: false,
      migratedCount: 0,
      error: error.message
    }
  }
}

/**
 * Verifica si ya se realizó la migración
 * @returns {boolean}
 */
export function hasMigrated() {
  return localStorage.getItem('budget-calculator-migrated') === 'true'
}

/**
 * Verifica si hay datos en localStorage pendientes de migrar
 * @returns {boolean}
 */
export function hasPendingMigration() {
  const localData = localStorage.getItem('budget-calculator-transactions')
  if (!localData) return false
  
  try {
    const transactions = JSON.parse(localData)
    return Array.isArray(transactions) && transactions.length > 0 && !hasMigrated()
  } catch {
    return false
  }
}

/**
 * Obtiene el conteo de transacciones pendientes de migrar
 * @returns {number}
 */
export function getPendingMigrationCount() {
  const localData = localStorage.getItem('budget-calculator-transactions')
  if (!localData) return 0
  
  try {
    const transactions = JSON.parse(localData)
    return Array.isArray(transactions) ? transactions.length : 0
  } catch {
    return 0
  }
}

/**
 * Resetea el estado de migración (útil para testing)
 */
export function resetMigrationStatus() {
  localStorage.removeItem('budget-calculator-migrated')
}
