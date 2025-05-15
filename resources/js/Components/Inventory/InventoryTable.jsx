import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Archive, Grid } from 'lucide-react';

const InventoryTable = ({ items, openModal, deleteItem, openLeaseModal, isItemLeasedByCurrentUser }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
        >
            <div className="p-5 bg-blue-800 border-b flex items-center">
                <Grid size={20} className="text-white mr-2" />
                <h2 className="text-xl font-bold text-white">Inventory Items</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Description</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Category</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Est. Price</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="py-8 text-center text-gray-500">
                                No items found matching your criteria
                            </td>
                        </tr>
                    ) : (
                        items.map((item, index) => (
                            <motion.tr
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="py-4 px-4">{item.name}</td>
                                <td className="py-4 px-4">{item.description}</td>
                                <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            item.quantity === 0 ? 'bg-red-100 text-red-800' :
                                                item.quantity <= 5 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                        }`}>
                                            {item.quantity}
                                        </span>
                                </td>
                                <td className="py-4 px-4">{item.category}</td>
                                <td className="py-4 px-4">${parseFloat(item.estimated_price).toFixed(2)}</td>
                                <td className="py-4 px-4">
                                    <div className="flex space-x-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => openModal(item)}
                                            className="p-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition"
                                        >
                                            <Edit size={16} />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this item?')) {
                                                    deleteItem(item.id);
                                                }
                                            }}
                                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>

                                        {!isItemLeasedByCurrentUser(item) && item.quantity > 0 && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => openLeaseModal(item)}
                                                className="p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                            >
                                                <Archive size={16} />
                                            </motion.button>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default InventoryTable;
