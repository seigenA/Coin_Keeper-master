import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addAccount } from '../../redux/slices/accountsSlice'

export default function AccountForm({ onCreated }) {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [currency, setCurrency] = useState('USD')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const resultAction = await dispatch(addAccount({ name, currency }))
        if (addAccount.fulfilled.match(resultAction)) {
            const newAccount = resultAction.payload
            setName('')
            setCurrency('USD')
            onCreated?.(newAccount.id)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-1 mb-4 bg-gray-100 dark:bg-gray-800 p-2 rounded shadow">
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Account Name"
                className="p-1 border rounded dark:bg-gray-700 dark:text-white text-sm w-32"
                required
            />
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="p-1 border rounded dark:bg-gray-700 dark:text-white text-sm w-20"
            >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="KZT">KZT</option>
                <option value="RUB">RUB</option>
            </select>
            <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
            >
                Create
            </button>
        </form>
    )
}