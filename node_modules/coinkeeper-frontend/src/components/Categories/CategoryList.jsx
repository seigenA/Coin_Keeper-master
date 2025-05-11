import { useDispatch, useSelector } from 'react-redux'
import { deleteCategory } from '../../redux/slices/categoriesSlice'

export default function CategoryList() {
    const categories = useSelector(s => s.categories.list)
    const dispatch = useDispatch()
    const status = useSelector(s => s.categories.status)

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteCategory(id))
        }
    }

    if (status === 'loading') return (
        <p className="text-gray-700 dark:text-gray-300 animate-pulse">Loading categories...</p>
    )

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white p-4 border-b dark:border-gray-600">
                Categories
            </h3>
            {categories.length === 0 ? (
                <p className="p-4 text-gray-700 dark:text-gray-300">No categories yet.</p>
            ) : (
                <table className="min-w-full">
                    <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Name</th>
                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Type</th>
                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Color</th>
                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(c => (
                        <tr
                            key={c.id}
                            className="border-b last:border-none dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                        >
                            <td className="p-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <span
                      className="w-4 h-4 rounded-full inline-block"
                      style={{ backgroundColor: c.color || '#000000' }}
                  />
                                {c.name}
                            </td>
                            <td className={`p-4 capitalize ${c.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {c.type}
                            </td>
                            <td className="p-4 text-gray-800 dark:text-white">{c.color || 'Default'}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="text-red-600 dark:text-red-400 hover:underline transition duration-150"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}