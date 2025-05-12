import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import accountsReducer from './slices/accountsSlice' // Убедись, что подключён
import categoriesReducer from './slices/categoriesSlice'
import transactionsReducer from './slices/transactionsSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer
  }
})