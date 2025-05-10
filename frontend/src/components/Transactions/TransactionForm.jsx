import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTransaction } from '../../redux/slices/transactionsSlice'
import { fetchAccounts } from '../../redux/slices/accountsSlice'


export default function TransactionForm({ accountId }) {
  const dispatch = useDispatch()
  const categories = useSelector(s => s.categories.list)
  const accounts = useSelector(s => s.accounts.list) // Получаем список аккаунтов из состояния Redux
  const [form, setForm] = useState({
    type: 'expense', amount: '', categoryId: '', date: new Date().toISOString().split('T')[0], comment: ''
  })

  useEffect(() => {
    dispatch(fetchAccounts()) // Загружаем аккаунты при монтировании компонента
  }, [dispatch])

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = e => {
    e.preventDefault()
    if (!accountId) return alert('Select account first') // Проверяем, выбран ли аккаунт
    dispatch(addTransaction({ ...form, amount: Number(form.amount), accountId }))
    setForm({ ...form, amount: '', comment: '' })
  }

  return (
      <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 p-4 shadow rounded mb-4">
        <div className="flex flex-wrap gap-2">
          <select name="type" value={form.type} onChange={onChange} className="border rounded p-2 dark:bg-gray-700 dark:text-white">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input name="amount" type="number" step="0.01" value={form.amount} onChange={onChange}
                 placeholder="Amount" className="border rounded p-2 w-24 dark:bg-gray-700 dark:text-white" required />
          <select name="categoryId" value={form.categoryId} onChange={onChange}
                  className="border rounded p-2 dark:bg-gray-700 dark:text-white">
            <option value="">Category</option>
            {categories.filter(c => c.type === form.type).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input name="date" type="date" value={form.date} onChange={onChange}
                 className="border rounded p-2 dark:bg-gray-700 dark:text-white" />
          <input name="comment" value={form.comment} onChange={onChange} placeholder="Comment"
                 className="border rounded p-2 flex-grow dark:bg-gray-700 dark:text-white" />
          <button className="bg-purple-600 text-white px-4 rounded">Add</button>
        </div>
      </form>
  )
}
