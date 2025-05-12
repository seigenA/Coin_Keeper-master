import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export default function StatsPage() {
  const transactions = useSelector(s => s.transactions.list)
  const categories = useSelector(s => s.categories.list)
  const accounts = useSelector(s => s.accounts.list)
  const selectedAccountId = localStorage.getItem('selectedAccount')

  const selectedAccount = accounts.find(a => a.id === (selectedAccountId ? JSON.parse(selectedAccountId).id : null))
  console.log('Selected Account:', selectedAccount) // Отладочный вывод

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const [dateRange, setDateRange] = useState({ start: '', end: '' }) // По умолчанию "All Time"
  const [filterType, setFilterType] = useState('allTime') // По умолчанию "All Time"

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

  const filteredTransactions = transactions.filter(t => {
    if (!t.date) return false
    if (!dateRange.start || !dateRange.end) return true
    const transactionDate = new Date(t.date)
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    return transactionDate >= startDate && transactionDate <= endDate
  })

  const balance = transactions.reduce(
      (acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
  )

  const pieData = categories.map(cat => {
    const total = filteredTransactions
        .filter(t => String(t.categoryId) === String(cat.id))
        .reduce((sum, t) => sum + Number(t.amount), 0)
    return { name: cat.name, value: total, color: cat.color || '#8884d8' }
  }).filter(d => d.value > 0)

  const barData = categories.map(cat => {
    const income = filteredTransactions
        .filter(t => String(t.categoryId) === String(cat.id) && t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    const expense = filteredTransactions
        .filter(t => String(t.categoryId) === String(cat.id) && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    return { name: cat.name, income, expense }
  }).filter(d => d.income > 0 || d.expense > 0)

  const formatDate = (dateStr) => {
    if (!dateStr) return 'the beginning'
    return format(new Date(dateStr), 'd MMM yyyy')
  }

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Statistics</h1>
          <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            Balance: {balance.toFixed(2)} {selectedAccount ? selectedAccount.currency : 'USD'}
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter by Date</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
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
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
              Showing statistics from {formatDate(dateRange.start)} to {formatDate(dateRange.end || new Date().toISOString().split('T')[0])}
            </p>
          </div>

          {filteredTransactions.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300">No transactions for this period.</p>
          ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Category Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                      >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Income vs Expense by Category</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="income" fill="#82ca9d" name="Income" />
                      <Bar dataKey="expense" fill="#ff5555" name="Expense" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
          )}
        </div>
      </div>
  )
}