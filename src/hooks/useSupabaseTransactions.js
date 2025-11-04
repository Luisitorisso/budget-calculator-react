import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useSupabaseTransactions = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)

  // Cargar transacciones desde Supabase
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error

      // Transformar datos al formato esperado por la app
      const formattedTransactions = data.map(t => ({
        id: t.id,
        description: t.description,
        amount: parseFloat(t.amount),
        category: t.category || '',
        type: t.type,
        date: t.date
      }))

      setTransactions(formattedTransactions)
      setError(null)
    } catch (err) {
      console.error('Error al cargar transacciones:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Agregar transacción
  const addTransaction = async (transaction) => {
    if (!user) return { error: 'No hay usuario autenticado' }

    try {
      setSyncing(true)
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category || null,
            type: transaction.type,
            date: transaction.date || new Date().toISOString().split('T')[0]
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Agregar a estado local inmediatamente (optimistic update)
      const formattedTransaction = {
        id: data.id,
        description: data.description,
        amount: parseFloat(data.amount),
        category: data.category || '',
        type: data.type,
        date: data.date
      }

      setTransactions(prev => [formattedTransaction, ...prev])
      return { data: formattedTransaction, error: null }
    } catch (err) {
      console.error('Error al agregar transacción:', err)
      return { data: null, error: err.message }
    } finally {
      setSyncing(false)
    }
  }

  // Actualizar transacción
  const updateTransaction = async (id, updates) => {
    if (!user) return { error: 'No hay usuario autenticado' }

    try {
      setSyncing(true)
      const { data, error } = await supabase
        .from('transactions')
        .update({
          description: updates.description,
          amount: updates.amount,
          category: updates.category || null,
          type: updates.type,
          date: updates.date
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      // Actualizar estado local
      const formattedTransaction = {
        id: data.id,
        description: data.description,
        amount: parseFloat(data.amount),
        category: data.category || '',
        type: data.type,
        date: data.date
      }

      setTransactions(prev =>
        prev.map(t => (t.id === id ? formattedTransaction : t))
      )

      return { data: formattedTransaction, error: null }
    } catch (err) {
      console.error('Error al actualizar transacción:', err)
      return { data: null, error: err.message }
    } finally {
      setSyncing(false)
    }
  }

  // Eliminar transacción
  const deleteTransaction = async (id) => {
    if (!user) return { error: 'No hay usuario autenticado' }

    try {
      setSyncing(true)
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // Actualizar estado local
      setTransactions(prev => prev.filter(t => t.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error al eliminar transacción:', err)
      return { error: err.message }
    } finally {
      setSyncing(false)
    }
  }

  // Cargar transacciones al montar y cuando cambie el usuario
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Suscripción en tiempo real a cambios en la base de datos
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Cambio detectado:', payload)

          if (payload.eventType === 'INSERT') {
            const newTransaction = {
              id: payload.new.id,
              description: payload.new.description,
              amount: parseFloat(payload.new.amount),
              category: payload.new.category || '',
              type: payload.new.type,
              date: payload.new.date
            }
            setTransactions(prev => [newTransaction, ...prev])
          }

          if (payload.eventType === 'UPDATE') {
            const updatedTransaction = {
              id: payload.new.id,
              description: payload.new.description,
              amount: parseFloat(payload.new.amount),
              category: payload.new.category || '',
              type: payload.new.type,
              date: payload.new.date
            }
            setTransactions(prev =>
              prev.map(t => (t.id === payload.new.id ? updatedTransaction : t))
            )
          }

          if (payload.eventType === 'DELETE') {
            setTransactions(prev => prev.filter(t => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return {
    transactions,
    loading,
    syncing,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  }
}
