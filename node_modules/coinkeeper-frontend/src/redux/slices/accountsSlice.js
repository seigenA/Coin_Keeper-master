import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'
import { selectUserId } from './authSlice'

export const fetchAccounts = createAsyncThunk('accounts/fetch', async (_, { getState }) => {
  const userId = selectUserId(getState())
  const res = await api.get(`/accounts?userId=${userId}`)
  return res.data
})

export const addAccount = createAsyncThunk('accounts/add', async (account, { getState }) => {
  const userId = selectUserId(getState())
  const res = await api.post('/accounts', { ...account, userId })
  return res.data
})

const slice = createSlice({
  name: 'accounts',
  initialState: { list: [], status: 'idle' },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.fulfilled, (s, a) => { s.list = a.payload })
      .addCase(addAccount.fulfilled, (s, a) => { s.list.push(a.payload) })
  }
})


export default slice.reducer
