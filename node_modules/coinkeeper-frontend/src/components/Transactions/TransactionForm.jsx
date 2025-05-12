import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTransaction } from '../../redux/slices/transactionsSlice'
import { toast } from 'react-toastify'

export default function TransactionForm({ accountId }) {
  const dispatch = useDispatch()
  const categories = useSelector(s => s.categories.list)
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    categoryId: categories[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    comment: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const updatedForm = { ...prev, [name]: value }
      if (name === 'type') {
        updatedForm.categoryId = categories.find(c => c.type === value)?.id || ''
      }
      return updatedForm
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!accountId) return toast.error('Select account first', { position: 'top-right' })
    try {
      await dispatch(addTransaction({ ...form, amount: Number(form.amount), accountId })).unwrap()
      toast.success('Transaction added successfully!', { position: 'top-right' })
      setForm(prev => ({ ...prev, amount: '', comment: '', categoryId: categories.find(c => c.type === prev.type)?.id || '' }))
    } catch (err) {
      toast.error('Failed to add transaction: ' + err.message, { position: 'top-right' })
    }
  }

  return (
      <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transition-all duration-300"
      >
        <div className="flex flex-wrap gap-3">
          <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="border rounded-lg p-2 w-24 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
          />
          <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Select Category</option>
            {categories
                .filter(c => c.type === form.type)
                .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
          </select>
          <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Comment"
              className="border rounded-lg p-2 flex-grow bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-purple-700 transform hover:scale-105 transition duration-200"
          >
            Add
          </button>
        </div>
      </form>
  )
}