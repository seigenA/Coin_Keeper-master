import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'
import { selectUserId } from './authSlice'

export const fetchTransactions = createAsyncThunk('transactions/fetch', async ({ accountId }, { getState }) => {
  const userId = selectUserId(getState())
  const res = await api.get(`/transactions?userId=${userId}&accountId=${accountId}`)
  return res.data
})

export const addTransaction = createAsyncThunk('transactions/add', async (transaction, { getState }) => {
  const userId = selectUserId(getState())
  const res = await api.post('/transactions', { ...transaction, userId })
  return res.data
})

export const updateTransaction = createAsyncThunk('transactions/update', async ({ id, updates }) => {
  const res = await api.put(`/transactions/${id}`, updates)
  return res.data
})

export const deleteTransaction = createAsyncThunk('transactions/delete', async (id) => {
  await api.delete(`/transactions/${id}`)
  return id
})

const slice = createSlice({
  name: 'transactions',
  initialState: { list: [], status: 'idle', error: null },
  extraReducers: (b) => {
    b
        .addCase(fetchTransactions.pending, (s) => { s.status = 'loading'; s.error = null })
        .addCase(fetchTransactions.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload })
        .addCase(fetchTransactions.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
        .addCase(addTransaction.pending, (s) => { s.status = 'loading'; s.error = null })
        .addCase(addTransaction.fulfilled, (s, a) => { s.status = 'succeeded'; s.list.push(a.payload) })
        .addCase(addTransaction.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
        .addCase(updateTransaction.pending, (s) => { s.status = 'loading'; s.error = null })
        .addCase(updateTransaction.fulfilled, (s, a) => {
          s.status = 'succeeded'
          const index = s.list.findIndex(t => t.id === a.payload.id)
          if (index !== -1) s.list[index] = a.payload
        })
        .addCase(updateTransaction.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
        .addCase(deleteTransaction.pending, (s) => { s.status = 'loading'; s.error = null })
        .addCase(deleteTransaction.fulfilled, (s, a) => {
          s.status = 'succeeded'
          s.list = s.list.filter(t => t.id !== a.payload)
        })
        .addCase(deleteTransaction.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
  }
})

export default slice.reducer