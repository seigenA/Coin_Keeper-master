import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'
import { fetchAccounts } from '../redux/slices/accountsSlice'
import { fetchTransactions, updateTransaction } from '../redux/slices/transactionsSlice'
import TransactionForm from '../components/Transactions/TransactionForm'
import TransactionList from '../components/Transactions/TransactionList'
import { useTheme } from '../context/ThemeContext'
import AccountForm from '../components/Accounts/AccountForm'
import { toast } from 'react-toastify'

export default function DashboardPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accounts = useSelector(s => s.accounts.list)
    const transactions = useSelector(s => s.transactions.list)
    const categories = useSelector(s => s.categories.list) // Добавляем импорт categories
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [editTransaction, setEditTransaction] = useState(null)

    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const [dateRange, setDateRange] = useState({
        start: firstDayOfMonth.toISOString().split('T')[0],
        end: lastDayOfMonth.toISOString().split('T')[0]
    })
    const [filterType, setFilterType] = useState('thisMonth')
    const { theme, toggleTheme } = useTheme()

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const setLast7Days = () => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - 7)
        setDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        })
        setFilterType('last7Days')
    }

    const setThisMonth = () => {
        const today = new Date()
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        setDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        })
        setFilterType('thisMonth')
    }

    const setLastMonth = () => {
        const today = new Date()
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const end = new Date(today.getFullYear(), today.getMonth(), 0)
        setDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        })
        setFilterType('lastMonth')
    }

    const setAllTime = () => {
        setDateRange({ start: '', end: '' })
        setFilterType('allTime')
    }

    const handleCustomDateChange = (field, value) => {
        setDateRange(prev => ({ ...prev, [field]: value }))
        setFilterType('custom')
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

    const filteredTransactions = transactions.filter(t => {
        if (!t.date) return false
        if (!dateRange.start || !dateRange.end) return true
        const transactionDate = new Date(t.date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return transactionDate >= startDate && transactionDate <= endDate
    })

    const balance = filteredTransactions.reduce(
        (acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
        0
    )

    const handleEdit = (transaction) => {
        setEditTransaction(transaction)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await dispatch(updateTransaction({ id: editTransaction.id, updates: editTransaction })).unwrap()
            toast.success('Transaction updated successfully!', { position: "top-right" })
            setEditTransaction(null)
        } catch (err) {
            toast.error('Failed to update transaction: ' + err.message, { position: "top-right" })
        }
    }

    const onChangeEdit = (e) => {
        const { name, value } = e.target
        setEditTransaction(prev => {
            const updatedTransaction = { ...prev, [name]: value }
            if (name === 'type') {
                updatedTransaction.categoryId = ''
            }
            return updatedTransaction
        })
    }

    const getCatName = id => categories.find(c => c.id === Number(id))?.name || id
    const selectedAccountData = accounts.find(a => a.id === selectedAccount)

    return (
        <div className="p-6">
            <nav className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                    Dashboard
                </h1>
                <div className="flex gap-4">
                    <Link to="/stats" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Statistics
                    </Link>
                    <Link to="/settings" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Settings
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-200"
                    >
                        {theme === 'dark' ? 'Light' : 'Dark'} Mode
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <AccountForm onCreated={(id) => setSelectedAccount(id)} />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                    <label htmlFor="acc" className="text-gray-700 dark:text-gray-300 font-medium">
                        Account:
                    </label>
                    <select
                        id="acc"
                        value={selectedAccount || ''}
                        onChange={(e) => setSelectedAccount(Number(e.target.value))}
                        className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                    >
                        <option value="" disabled>Select Account</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>
                {selectedAccount && (
                    <span className="sm:ml-auto text-2xl font-semibold text-gray-800 dark:text-white">
            Balance: {balance.toFixed(2)} {selectedAccountData?.currency || 'USD'}
          </span>
                )}
            </div>

            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filter by Date</h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <button
                        onClick={setLast7Days}
                        className={`px-4 py-2 rounded-full shadow-md transition duration-200 ${filterType === 'last7Days' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={setThisMonth}
                        className={`px-4 py-2 rounded-full shadow-md transition duration-200 ${filterType === 'thisMonth' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={setLastMonth}
                        className={`px-4 py-2 rounded-full shadow-md transition duration-200 ${filterType === 'lastMonth' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        Last Month
                    </button>
                    <button
                        onClick={setAllTime}
                        className={`px-4 py-2 rounded-full shadow-md transition duration-200 ${filterType === 'allTime' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        All Time
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium">Start Date:</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => handleCustomDateChange('start', e.target.value)}
                            className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium">End Date:</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => handleCustomDateChange('end', e.target.value)}
                            className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Showing transactions from {dateRange.start || 'the beginning'} to {dateRange.end || 'now'}
                </p>
            </div>

            <TransactionForm accountId={selectedAccount} />
            <div className="overflow-x-auto">
                <TransactionList transactions={filteredTransactions} onEdit={handleEdit} />
            </div>

            {editTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-11/12 max-w-md transform transition-transform duration-300 scale-95 animate-modal-open"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Transaction</h2>
                        <div className="flex flex-col gap-4">
                            <select
                                name="type"
                                value={editTransaction.type}
                                onChange={onChangeEdit}
                                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                value={editTransaction.amount}
                                onChange={onChangeEdit}
                                placeholder="Amount"
                                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                required
                            />
                            <select
                                name="categoryId"
                                value={editTransaction.categoryId}
                                onChange={onChangeEdit}
                                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                            >
                                <option value="">Category</option>
                                {categories
                                    .filter(c => c.type === editTransaction.type)
                                    .map(c => (
                                        <option key={c.id} value={c.id}>{getCatName(c.id)}</option>
                                    ))}
                            </select>
                            <input
                                name="date"
                                type="date"
                                value={editTransaction.date}
                                onChange={onChangeEdit}
                                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            <input
                                name="comment"
                                value={editTransaction.comment}
                                onChange={onChangeEdit}
                                placeholder="Comment"
                                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-200"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditTransaction(null)}
                                className="bg-gray-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-700 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}