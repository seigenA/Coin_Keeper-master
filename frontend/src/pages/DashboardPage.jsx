import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'
import { fetchAccounts } from '../redux/slices/accountsSlice'
import { fetchTransactions } from '../redux/slices/transactionsSlice'
import TransactionForm from '../components/Transactions/TransactionForm'
import TransactionList from '../components/Transactions/TransactionList'
import { useTheme } from '../context/ThemeContext'
import AccountForm from '../components/Accounts/AccountForm'

export default function Dashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accounts = useSelector(s => s.accounts.list)
    const transactions = useSelector(s => s.transactions.list)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const { theme, toggleTheme } = useTheme()

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    useEffect(() => {
        dispatch(fetchAccounts())
    }, [dispatch])

    useEffect(() => {
        if (accounts.length && selectedAccount === null) {
            const saved = localStorage.getItem('selectedAccount')
            setSelectedAccount(saved ? Number(saved) : accounts[accounts.length - 1].id)
        }
    }, [accounts])

    useEffect(() => {
        if (selectedAccount !== null) {
            localStorage.setItem('selectedAccount', selectedAccount)
        }
    }, [selectedAccount])

    useEffect(() => {
        if (selectedAccount) dispatch(fetchTransactions({ accountId: selectedAccount }))
    }, [dispatch, selectedAccount])

    const balance = transactions.reduce(
        (acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount),
        0
    )

    return (
        <div className="container mx-auto p-4 relative">
            {/* Theme + Logout */}
            <div className="absolute top-4 right-4 flex gap-4">
                <button onClick={toggleTheme} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow">
                    {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow">
                    Logout
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

            {/* 👇 Добавление аккаунта (компактно) */}
            <AccountForm onCreated={(id) => setSelectedAccount(id)} />

            <div className="mb-4 flex gap-2 items-center">
                <label htmlFor="acc">Account:</label>
                <select
                    id="acc"
                    value={selectedAccount || ''}
                    onChange={(e) => setSelectedAccount(Number(e.target.value))}
                    className="border rounded p-2 dark:bg-gray-700 dark:text-white"
                >
                    <option value="" disabled>Select Account</option>
                    {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>
                {selectedAccount && (
                    <span className="ml-auto text-xl">Balance: {balance.toFixed(2)}</span>
                )}
            </div>

            <TransactionForm accountId={selectedAccount} />
            <TransactionList transactions={transactions} />
        </div>
    )
}