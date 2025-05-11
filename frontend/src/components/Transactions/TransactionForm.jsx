import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTransaction } from '../../redux/slices/transactionsSlice'
import { addCategory } from '../../redux/slices/categoriesSlice'

export default function TransactionForm({ accountId }) {
  const dispatch = useDispatch()
  const categories = useSelector(s => s.categories.list)
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    comment: ''
  })
  const [newCategory, setNewCategory] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const updatedForm = { ...prev, [name]: value }
      if (name === 'type') {
        updatedForm.categoryId = '' // Сбрасываем категорию при смене типа
      }
      return updatedForm
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!accountId) return alert('Select account first')
    dispatch(addTransaction({ ...form, amount: Number(form.amount), accountId }))
    setForm(prev => ({ ...prev, amount: '', comment: '', categoryId: '' }))
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (newCategory) {
      dispatch(addCategory({ name: newCategory, type: form.type }))
      setNewCategory('')
    }
  }

  return (
      <form
          onSubmit={onSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transition-all duration-300"
      >
        <div className="flex flex-wrap gap-3">
          <select
              name="type"
              value={form.type}
              onChange={onChange}
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
              onChange={onChange}
              placeholder="Amount"
              className="border rounded-lg p-2 w-24 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
          />
          <select
              name="categoryId"
              value={form.categoryId}
              onChange={onChange}
              className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Category</option>
            {categories
                .filter(c => c.type === form.type)
                .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
          </select>
          <div className="flex gap-2">
            <input
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="New category"
                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <button
                type="button"
                onClick={handleAddCategory}
                className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-teal-700 transform hover:scale-105 transition duration-200"
            >
              Add Category
            </button>
          </div>
          <input
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
              name="comment"
              value={form.comment}
              onChange={onChange}
              placeholder="Comment"
              className="border rounded-lg p-2 flex-grow bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-purple-700 transform hover:scale-105 transition duration-200"
          >
            Add
          </button>
        </div>
      </form>
  )
}