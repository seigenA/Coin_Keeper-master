import { useDispatch, useSelector } from 'react-redux'
import { deleteTransaction } from '../../redux/slices/transactionsSlice'

export default function TransactionList({ transactions }) {
    const categories = useSelector(s => s.categories.list)
    const dispatch = useDispatch()

    if (!transactions.length) return <p className="text-gray-700 dark:text-gray-300">No transactions.</p>

    const getCatName = id => categories.find(c => c.id === id)?.name || id

    return (
        <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded">
            <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2 text-left text-gray-700 dark:text-gray-300">Date</th>
                <th className="p-2 text-left text-gray-700 dark:text-gray-300">Type</th>
                <th className="p-2 text-left text-gray-700 dark:text-gray-300">Amount</th>
                <th className="p-2 text-left text-gray-700 dark:text-gray-300">Category</th>
                <th className="p-2 text-left text-gray-700 dark:text-gray-300">Comment</th>
                <th className="p-2 text-left text-gray-700 dark:text-gray-300" />
            </tr>
            </thead>
            <tbody>
            {transactions.map(t => (
                <tr key={t.id} className="border-b last:border-none dark:border-gray-600">
                    <td className="p-2 text-gray-700 dark:text-gray-300">{t.date}</td>
                    <td className="p-2 capitalize text-gray-700 dark:text-gray-300">{t.type}</td>
                    <td className="p-2 text-gray-700 dark:text-gray-300">{t.amount.toFixed(2)}</td>
                    <td className="p-2 text-gray-700 dark:text-gray-300">{getCatName(t.categoryId)}</td>
                    <td className="p-2 text-gray-700 dark:text-gray-300">{t.comment}</td>
                    <td className="p-2">
                        <button onClick={() => dispatch(deleteTransaction(t.id))} className="text-red-600 dark:text-red-400">Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
