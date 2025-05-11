import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addCategory } from '../../redux/slices/categoriesSlice'

export default function CategoryForm({ type }) {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [color, setColor] = useState('#000000')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name.trim()) return
        dispatch(addCategory({ name, type, color }))
        setName('')
        setColor('#000000')
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 flex-1">
        <span className={`text-sm font-medium ${type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {type === 'income' ? '💰' : '💸'} {type.charAt(0).toUpperCase() + type.slice(1)} Category
        </span>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={`Add ${type} category`}
                    className="flex-1 border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>
            <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-10 h-10 rounded-full border-none cursor-pointer"
            />
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 hover:scale-105 transition-transform duration-200 flex items-center gap-2"
            >
                <span>➕ Add</span>
            </button>
        </form>
    )
}