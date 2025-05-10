import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/slices/authSlice'
import { Navigate, Link } from 'react-router-dom'

export default function LoginForm() {
    const dispatch = useDispatch()
    const status = useSelector(s => s.auth.status)
    const isAuth = useSelector(s => !!s.auth.user)
    const error = useSelector(s => s.auth.error)
    const [form, setForm] = useState({ email: '', password: '' })

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
    const onSubmit = e => { e.preventDefault(); dispatch(login(form)) }

    if (isAuth) return <Navigate to="/dashboard" />

    return (
        <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg w-full max-w-md">
            <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-6">Login</h2>
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                />
            </div>
            <button
                disabled={status === 'loading'}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
            >
                Sign in
            </button>
            <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-500 hover:text-blue-600">Register</Link>
            </p>
        </form>
    )
}
