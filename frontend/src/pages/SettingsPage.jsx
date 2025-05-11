import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, addCategory } from '../redux/slices/categoriesSlice'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function SettingsPage() {
  const dispatch = useDispatch()
  const categories = useSelector(s => s.categories.list)
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense', color: '#000000' })

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewCategory(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(addCategory(newCategory)).unwrap()
      toast.success('Category added successfully!', { position: "top-right" })
      setNewCategory({ name: '', type: 'expense', color: '#000000' })
    } catch (err) {
      toast.error('Failed to add category: ' + err.message, { position: "top-right" })
    }
  }

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Settings</h1>
          <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Categories</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
            <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                placeholder="Category Name"
                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
            />
            <select
                name="type"
                value={newCategory.type}
                onChange={handleChange}
                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
                type="color"
                name="color"
                value={newCategory.color}
                onChange={handleChange}
                className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-700 transition duration-200"
            >
              Add Category
            </button>
          </form>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
                <li key={cat.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                  <span className="text-gray-800 dark:text-gray-200">{cat.name}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">({cat.type})</span>
                  <span className="ml-2 inline-block w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></span>
                </li>
            ))}
          </ul>
        </div>
      </div>
  )
}