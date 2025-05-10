import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'
import { selectUserId } from './authSlice'

export const fetchTransactions = createAsyncThunk('transactions/fetch', async (query, { getState }) => {
  const userId = selectUserId(getState())
  const q = new URLSearchParams({ userId, _sort:'date', _order:'desc', ...(query||{}) }).toString()
  const res = await api.get(`/transactions?${q}`)
  return res.data
})

export const addTransaction = createAsyncThunk('transactions/add', async (tx, { getState }) => {
  const userId = selectUserId(getState())
  const res = await api.post('/transactions', { ...tx, userId })
  return res.data
})

export const deleteTransaction = createAsyncThunk('transactions/delete', async (id) => {
  await api.delete(`/transactions/${id}`)
  return id
})

const slice = createSlice({
  name: 'transactions',
  initialState: { list: [], status: 'idle' },
  extraReducers: (b) => {
    b
      .addCase(fetchTransactions.fulfilled, (s, a) => { s.list = a.payload })
      .addCase(addTransaction.fulfilled, (s, a) => { s.list.unshift(a.payload) })
      .addCase(deleteTransaction.fulfilled, (s, a) => { s.list = s.list.filter(t => t.id !== a.payload) })
  }
})

export default slice.reducer
