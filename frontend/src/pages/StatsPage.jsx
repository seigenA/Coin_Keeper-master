import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function StatsPage() {
  const transactions = useSelector(s => s.transactions.list)
  const categories = useSelector(s => s.categories.list)

  // Фильтрация транзакций (по текущему месяцу по умолчанию)
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const filteredTransactions = transactions.filter(t => {
    if (!t.date) return false
    const transactionDate = new Date(t.date)
    return transactionDate >= firstDayOfMonth && transactionDate <= lastDayOfMonth
  })

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

  const balance = filteredTransactions.reduce(
      (acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
  )

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Statistics</h1>
          <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            Balance: {balance.toFixed(2)} USD
          </p>
          {filteredTransactions.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300">No transactions for this month.</p>
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