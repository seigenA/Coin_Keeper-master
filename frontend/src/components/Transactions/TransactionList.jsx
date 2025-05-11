import { useDispatch, useSelector } from 'react-redux'
import { deleteTransaction } from '../../redux/slices/transactionsSlice'

export default function TransactionList({ transactions, onEdit }) {
    const categories = useSelector(s => s.categories.list)
    const dispatch = useDispatch()
    const status = useSelector(s => s.transactions.status)
    const error = useSelector(s => s.transactions.error)

    if (!transactions.length) return <p className="text-gray-700 dark:text-gray-300 text-lg">No transactions yet.</p>

    const getCatName = id => categories.find(c => c.id === Number(id))?.name || id

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await dispatch(deleteTransaction(id)).unwrap()
            } catch (err) {
                console.error('Failed to delete transaction:', err)
            }
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {status === 'loading' && <p className="p-4 text-gray-700 dark:text-gray-300 animate-pulse">Loading...</p>}
            {error && <p className="p-4 text-red-600 dark:text-red-400">Error: {error}</p>}
            <table className="min-w-full">
                <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Date</th>
                    <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Type</th>
                    <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Amount</th>
                    <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Category</th>
                    <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Comment</th>
                    <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map(t => (
                    <tr
                        key={t.id}
                        className="border-b last:border-none dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                    >
                        <td className="p-4 text-gray-700 dark:text-gray-300">{t.date}</td>
                        <td className="p-4 capitalize text-gray-700 dark:text-gray-300">{t.type}</td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">{Number(t.amount).toFixed(2)}</td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">{getCatName(t.categoryId)}</td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">{t.comment || '-'}</td>
                        <td className="p-4">
                            <button
                                onClick={() => onEdit(t)}
                                className="text-blue-600 dark:text-blue-400 mr-3 hover:underline transition duration-150"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(t.id)}
                                className="text-red-600 dark:text-red-400 hover:underline transition duration-150"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}