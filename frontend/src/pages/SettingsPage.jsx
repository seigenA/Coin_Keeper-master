import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, addCategory, deleteCategory } from '../redux/slices/categoriesSlice'
import { fetchAccounts, addAccount } from '../redux/slices/accountsSlice'

export default function Settings() {
  const dispatch = useDispatch()
  const categories = useSelector(s => s.categories.list)
  const accounts = useSelector(s => s.accounts.list)
  const [catName, setCatName] = useState('')
  const [catType, setCatType] = useState('expense')
  const [accName, setAccName] = useState('')
  const [accCurrency, setAccCurrency] = useState('USD')

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchAccounts())
  }, [dispatch])

  const addCat = e => { e.preventDefault(); if (catName) { dispatch(addCategory({ name: catName, type: catType })); setCatName('') } }
  const addAcc = e => { e.preventDefault(); if (accName) { dispatch(addAccount({ name: accName, currency: accCurrency })); setAccName('') } }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-2">Categories</h2>
        <form onSubmit={addCat} className="flex gap-2 mb-4">
          <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Name"
                 className="border rounded p-2 flex-grow" />
          <select value={catType} onChange={e => setCatType(e.target.value)} className="border rounded p-2">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button className="bg-blue-600 text-white px-4 rounded">Add</button>
        </form>
        <ul>
          {categories.map(c => (
            <li key={c.id} className="flex justify-between border-b py-1">
              <span>{c.name} <small className="text-gray-500">({c.type})</small></span>
              <button onClick={() => dispatch(deleteCategory(c.id))} className="text-red-500">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Accounts</h2>
        <form onSubmit={addAcc} className="flex gap-2 mb-4">
          <input value={accName} onChange={e => setAccName(e.target.value)} placeholder="Account name"
                 className="border rounded p-2 flex-grow" />
          <select value={accCurrency} onChange={e => setAccCurrency(e.target.value)} className="border rounded p-2">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="KZT">KZT</option>
          </select>
          <button className="bg-blue-600 text-white px-4 rounded">Add</button>
        </form>
        <ul>
          {accounts.map(a => (
            <li key={a.id} className="border-b py-1">{a.name} <small className="text-gray-500">({a.currency})</small></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
