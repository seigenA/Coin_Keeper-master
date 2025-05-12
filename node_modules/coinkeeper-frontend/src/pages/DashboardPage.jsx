import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'
import { fetchAccounts, deleteAccount } from '../redux/slices/accountsSlice'
import { fetchTransactions, updateTransaction } from '../redux/slices/transactionsSlice'
import { fetchCategories } from '../redux/slices/categoriesSlice'
import TransactionForm from '../components/Transactions/TransactionForm'
import TransactionList from '../components/Transactions/TransactionList'
import { useTheme } from '../context/ThemeContext'
import AccountForm from '../components/Accounts/AccountForm'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

export default function DashboardPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accounts = useSelector(s => s.accounts.list)
    const transactions = useSelector(s => s.transactions.list)
    const categories = useSelector(s => s.categories.list)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [editTransaction, setEditTransaction] = useState(null)

    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const [dateRange, setDateRange] = useState({ start: '', end: '' })
    const [filterType, setFilterType] = useState('allTime')
    const { theme, toggleTheme } = useTheme()

    const [page, setPage] = useState(1)
    const transactionsPerPage = 10

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
        setPage(1)
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
        setPage(1)
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
        setPage(1)
    }

    const setAllTime = () => {
        setDateRange({ start: '', end: '' })
        setFilterType('allTime')
        setPage(1)
    }

    const handleCustomDateChange = (field, value) => {
        setDateRange(prev => ({ ...prev, [field]: value }))
        setFilterType('custom')
        setPage(1)
    }

    const handleDeleteAccount = async (id) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                await dispatch(deleteAccount(id)).unwrap()
                if (selectedAccount === id) setSelectedAccount(accounts.length > 1 ? accounts[0].id : null)
                toast.success('Account deleted successfully!', { position: 'top-right' })
            } catch (err) {
                toast.error('Failed to delete account: ' + err.message, { position: 'top-right' })
            }
        }
    }

    useEffect(() => {
        dispatch(fetchAccounts())
        dispatch(fetchCategories())
    }, [dispatch])

    useEffect(() => {
        if (accounts.length && selectedAccount === null) {
            const saved = localStorage.getItem('selectedAccount')
            setSelectedAccount(saved ? Number(JSON.parse(saved).id) : accounts[0]?.id || null)
        }
    }, [accounts])

    useEffect(() => {
        if (selectedAccount !== null) {
            localStorage.setItem('selectedAccount', JSON.stringify({ id: selectedAccount }))
            dispatch(fetchTransactions({ accountId: selectedAccount }))
        }
    }, [dispatch, selectedAccount])

    const filteredTransactions = transactions.filter(t => {
        if (!t.date) return false
        if (!dateRange.start || !dateRange.end) return true
        const transactionDate = new Date(t.date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return transactionDate >= startDate && transactionDate <= endDate && t.accountId === selectedAccount
    })

    const paginatedTransactions = filteredTransactions.slice(
        (page - 1) * transactionsPerPage,
        page * transactionsPerPage
    )

    const balance = transactions
        .filter(t => t.accountId === selectedAccount)
        .reduce(
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
            toast.success('Transaction updated successfully!', { position: 'top-right' })
            setEditTransaction(null)
        } catch (err) {
            toast.error('Failed to update transaction: ' + err.message, { position: 'top-right' })
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

    const formatDate = (dateStr) => {
        if (!dateStr) return 'the beginning'
        return format(new Date(dateStr), 'd MMM yyyy')
    }

    return (
        <div className="p-4 sm:p-6">
            <nav className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight mb-4 sm:mb-0">
                    Dashboard
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Link to="/stats" className="text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base">
                        Statistics
                    </Link>
                    <Link to="/settings" className="text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base">
                        Settings
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="bg-gray-600 dark:bg-gray-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-md hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-200 text-sm sm:text-base"
                    >
                        {theme === 'dark' ? 'Light' : 'Dark'} Mode
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-md hover:bg-red-700 transition duration-200 text-sm sm:text-base"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <AccountForm onCreated={(id) => setSelectedAccount(id)} />

            <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                    <label htmlFor="acc" className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                        Account:
                    </label>
                    <select
                        id="acc"
                        value={selectedAccount || ''}
                        onChange={(e) => setSelectedAccount(Number(e.target.value))}
                        className="border rounded-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
                    >
                        <option value="" disabled>Select Account</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name} ({a.currency})
                            </option>
                        ))}
                    </select>
                    {selectedAccount && (
                        <button
                            onClick={() => handleDeleteAccount(selectedAccount)}
                            className="ml-1 sm:ml-2 bg-red-600 text-white px-1 sm:px-2 py-1 rounded-full shadow-md hover:bg-red-700 transition duration-200 text-xs sm:text-sm"
                        >
                            Delete
                        </button>
                    )}
                </div>
                {selectedAccount && (
                    <span className="sm:ml-auto text-lg sm:text-2xl font-semibold text-gray-800 dark:text-white">
                        Balance: {balance.toFixed(2)} {selectedAccountData?.currency || 'USD'}
                    </span>
                )}
            </div>

            <div className="mb-4 sm:mb-6 bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">Filter by Date</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2 sm:mb-4">
                    <button
                        onClick={setLast7Days}
                        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition duration-200 ${filterType === 'last7Days' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'} text-xs sm:text-base`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={setThisMonth}
                        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition duration-200 ${filterType === 'thisMonth' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'} text-xs sm:text-base`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={setLastMonth}
                        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition duration-200 ${filterType === 'lastMonth' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'} text-xs sm:text-base`}
                    >
                        Last Month
                    </button>
                    <button
                        onClick={setAllTime}
                        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition duration-200 ${filterType === 'allTime' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'} text-xs sm:text-base`}
                    >
                        All Time
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Start Date:</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => handleCustomDateChange('start', e.target.value)}
                            className="border rounded-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
                        />
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">End Date:</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => handleCustomDateChange('end', e.target.value)}
                            className="border rounded-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
                        />
                    </div>
                </div>
                <p className="mt-1 sm:mt-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    Showing transactions from {formatDate(dateRange.start)} to {formatDate(dateRange.end || new Date().toISOString().split('T')[0])}
                </p>
            </div>

            <TransactionForm accountId={selectedAccount} />
            <div className="overflow-x-auto">
                <TransactionList transactions={paginatedTransactions} onEdit={handleEdit} />
            </div>

            {filteredTransactions.length > transactionsPerPage && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">
                        Page {page} of {Math.ceil(filteredTransactions.length / transactionsPerPage)}
                    </span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * transactionsPerPage >= filteredTransactions.length}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                    >
                        Next
                    </button>
                </div>
            )}

            {editTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow-2xl w-11/12 max-w-md transform transition-transform duration-300 scale-95 animate-modal-open"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">Edit Transaction</h2>
                        <div className="flex flex-col gap-2 sm:gap-4">
                            <select
                                name="type"
                                value={editTransaction.type}
                                onChange={onChangeEdit}
                                className="border rounded-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
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
                                className="border rounded-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
                                required
                            />
                            <select
                                name="categoryId"
                                value={editTransaction.categoryId}
                                onChange={onChangeEdit}
                                className="border rounded-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
                            >
                                <option value="">Category</option>
                                {categories
                                    .filter(c => c.type === editTransaction.type)
                                    .map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                            </select>
                            <input
                                name="date"
                                type="date"
                                value={editTransaction.date}
                                onChange={onChangeEdit}
                                className="border rounded-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
                            />
                            <input
                                name="comment"
                                value={editTransaction.comment}
                                onChange={onChangeEdit}
                                placeholder="Comment"
                                className="border rounded-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
                            />
                        </div>
                        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-2 sm:px-6 py-1 sm:py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditTransaction(null)}
                                className="bg-gray-600 text-white px-2 sm:px-6 py-1 sm:py-2 rounded-full shadow-md hover:bg-gray-700 transition duration-200 text-sm sm:text-base"
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