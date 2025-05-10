import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

const userKey = 'ck_user'

export const register = createAsyncThunk('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const { data: existing } = await api.get(`/users?email=${credentials.email}`)
    if (existing.length) return rejectWithValue('User already exists')
    const res = await api.post('/users', credentials)
    return res.data
  } catch {
    return rejectWithValue('Registration failed')
  }
})

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/users?email=${email}&password=${password}`)
    if (!data.length) return rejectWithValue('Invalid credentials')
    return data[0]
  } catch {
    return rejectWithValue('Login failed')
  }
})

const initialState = {
  user: JSON.parse(localStorage.getItem(userKey)) || null,
  status: 'idle',
  error: null
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      localStorage.removeItem(userKey)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem(userKey, JSON.stringify(action.payload))
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem(userKey, JSON.stringify(action.payload))
      })
      .addMatcher(
        (a) => a.type.startsWith('auth/') && a.type.endsWith('/pending'),
        (state) => { state.status = 'loading'; state.error = null }
      )
      .addMatcher(
        (a) => a.type.startsWith('auth/') && a.type.endsWith('/rejected'),
        (state, action) => { state.status = 'failed'; state.error = action.payload }
      )
      .addMatcher(
        (a) => a.type.startsWith('auth/') && a.type.endsWith('/fulfilled'),
        (state) => { state.status = 'succeeded'; state.error = null; state.status='idle' }
      )
  }
})

export const selectUserId = state => state.auth.user?.id
export const { logout } = slice.actions
export default slice.reducer
