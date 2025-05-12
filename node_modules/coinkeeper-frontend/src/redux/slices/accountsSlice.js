import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async () => {
  const response = await api.get('/accounts')
  return response.data
})

export const addAccount = createAsyncThunk('accounts/addAccount', async (account) => {
  const response = await api.post('/accounts', account)
  return response.data
})

export const updateAccount = createAsyncThunk('accounts/updateAccount', async ({ id, updates }) => {
  const response = await api.put(`/accounts/${id}`, updates)
  return response.data
})

export const deleteAccount = createAsyncThunk('accounts/deleteAccount', async (id) => {
  await api.delete(`/accounts/${id}`)
  return id
})

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchAccounts.pending, (state) => {
          state.status = 'loading'
        })
        .addCase(fetchAccounts.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.list = action.payload
        })
        .addCase(fetchAccounts.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        })
        .addCase(addAccount.fulfilled, (state, action) => {
          state.list.push(action.payload)
        })
        .addCase(updateAccount.fulfilled, (state, action) => {
          const index = state.list.findIndex(a => a.id === action.payload.id)
          if (index !== -1) state.list[index] = action.payload
        })
        .addCase(deleteAccount.fulfilled, (state, action) => {
          state.list = state.list.filter(a => a.id !== action.payload)
        })
  }
})

export default accountsSlice.reducer