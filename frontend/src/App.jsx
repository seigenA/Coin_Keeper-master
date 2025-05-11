import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import 'react-toastify/dist/ReactToastify.css'

function AppRoutes() {
    const isAuth = useSelector(state => !!state.auth.user)
    const { theme } = useTheme()

    const Private = ({ children }) => (isAuth ? children : <Navigate to="/login" />)

    return (
        <div className={theme === 'dark' ? 'dark bg-gray-900 text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<Private><DashboardPage /></Private>} />
                <Route path="/dashboard" element={<Private><DashboardPage /></Private>} />
                <Route path="/stats" element={<Private><StatsPage /></Private>} />
                <Route path="/settings" element={<Private><SettingsPage /></Private>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    )
}

export default function App() {
    return (
        <ThemeProvider>
            <AppRoutes />
        </ThemeProvider>
    )
}