import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'
import { selectUserId } from './authSlice'

export const fetchCategories = createAsyncThunk('categories/fetch', async (_, { getState }) => {
  const userId = selectUserId(getState())
  const res = await api.get(`/categories?userId=${userId}`)
  return res.data
})

export const addCategory = createAsyncThunk('categories/add', async (cat, { getState }) => {
  const userId = selectUserId(getState())
  const res = await api.post('/categories', { ...cat, userId })
  return res.data
})

export const deleteCategory = createAsyncThunk('categories/delete', async (id) => {
  await api.delete(`/categories/${id}`)
  return id
})

const slice = createSlice({
  name: 'categories',
  initialState: { list: [], status: 'idle' },
  extraReducers: (b) => {
    b
      .addCase(fetchCategories.fulfilled, (s, a) => { s.list = a.payload })
      .addCase(addCategory.fulfilled, (s, a) => { s.list.push(a.payload) })
      .addCase(deleteCategory.fulfilled, (s, a) => { s.list = s.list.filter(c => c.id !== a.payload) })
  }
})

export default slice.reducer
