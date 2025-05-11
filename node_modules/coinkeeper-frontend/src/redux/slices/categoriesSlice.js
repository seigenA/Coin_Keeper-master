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
  initialState: { list: [], status: 'idle', error: null },
  extraReducers: (b) => {
    b
        .addCase(fetchCategories.pending, (s) => { s.status = 'loading'; s.error = null })
        .addCase(fetchCategories.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload })
        .addCase(fetchCategories.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
        .addCase(addCategory.pending, (s) => { s.status = 'loading'; s.error = null })
        .addCase(addCategory.fulfilled, (s, a) => { s.status = 'succeeded'; s.list.push(a.payload) })
        .addCase(addCategory.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
        .addCase(deleteCategory.pending, (s) => { s.status = 'loading'; s.error = null })
        .addCase(deleteCategory.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = s.list.filter(c => c.id !== a.payload) })
        .addCase(deleteCategory.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
  }
})

export default slice.reducer