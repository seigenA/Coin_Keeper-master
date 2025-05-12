import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAccount, fetchAccounts } from '../../redux/slices/accountsSlice'
import { toast } from 'react-toastify'
import { useTheme } from '../../context/ThemeContext'

export default function AccountForm({ onCreated }) {
    const dispatch = useDispatch()
    const accounts = useSelector(s => s.accounts.list)
    const [form, setForm] = useState({ name: '', currency: 'KZT' }) // Изменяем валюту по умолчанию на KZT
    const [editAccountId, setEditAccountId] = useState(null)
    const { theme } = useTheme()

    useEffect(() => {
        dispatch(fetchAccounts())
    }, [dispatch])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editAccountId) {
                await dispatch(updateAccount({ id: editAccountId, updates: form })).unwrap()
                toast.success('Account updated successfully!', { position: 'top-right' })
                setEditAccountId(null)
            } else {
                const result = await dispatch(addAccount(form)).unwrap()
                if (onCreated) onCreated(result.id)
                toast.success('Account created successfully!', { position: 'top-right' })
            }
            setForm({ name: '', currency: 'KZT' })
        } catch (err) {
            toast.error('Failed to save account: ' + err.message, { position: 'top-right' })
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`mb-6 flex gap-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Account Name"
                className={`border rounded-lg p-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 transition duration-200`}
                required
            />
            <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className={`border rounded-lg p-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 transition duration-200`}
            >
                <option value="KZT">KZT</option>
                <option value="USD">USD</option>
                <option value="RUB">RUB</option>
                <option value="EUR">EUR</option>
            </select>
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition duration-200"
            >
                {editAccountId ? 'Save' : 'Create'}
            </button>
            {editAccountId && (
                <button
                    type="button"
                    onClick={() => { setEditAccountId(null); setForm({ name: '', currency: 'KZT' }); }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 transition duration-200"
                >
                    Cancel
                </button>
            )}
        </form>
    )
}