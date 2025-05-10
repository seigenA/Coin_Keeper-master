import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAccounts } from '../redux/slices/accountsSlice'
import { fetchTransactions } from '../redux/slices/transactionsSlice'
import { fetchCategories } from '../redux/slices/categoriesSlice'
import { PieChart, Pie, Tooltip } from 'recharts'

export default function Stats() {
  const dispatch = useDispatch()
  const accounts = useSelector(s => s.accounts.list)
  const categories = useSelector(s => s.categories.list)
  const transactions = useSelector(s => s.transactions.list)

  const [accountId, setAccountId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => { dispatch(fetchAccounts()) }, [dispatch])
  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])
  useEffect(() => {
    const query = {}
    if (accountId) query.accountId = accountId
    if (from) query.date_gte = from
    if (to) query.date_lte = to
    dispatch(fetchTransactions(query))
  }, [dispatch, accountId, from, to])

  const dataByCat = categories.map(c => {
    const sum = transactions
      .filter(t => t.categoryId === c.id)
      .reduce((acc, t) => acc + t.amount * (t.type === 'income' ? 1 : -1), 0)
    return { name: c.name, value: Math.abs(sum) }
  }).filter(d => d.value > 0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Statistics</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <select value={accountId} onChange={e => setAccountId(e.target.value)} className="border rounded p-2">
          <option value="">All accounts</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded p-2" />
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded p-2" />
      </div>
      <PieChart width={400} height={400}>
        <Pie dataKey="value" nameKey="name" data={dataByCat} cx="50%" cy="50%" outerRadius={150} />
        <Tooltip />
      </PieChart>
    </div>
  )
}
