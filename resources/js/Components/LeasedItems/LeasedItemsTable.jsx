import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Info } from 'lucide-react';

export default function LeasedItemsTable({
                                             filteredItems,
                                             handleSort,
                                             getSortIcon,
                                             formatDate,
                                             setConfirmReturn,
                                             handleViewDetails
                                         }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('item.name')}>
                        Item Name {getSortIcon('item.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('item.description')}>
                        Description {getSortIcon('item.description')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('quantity')}>
                        Quantity {getSortIcon('quantity')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lease_until')}>
                        Leased Until {getSortIcon('lease_until')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((lease) => (
                    <tr key={`lease-${lease.id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{lease.item?.name}</td>
                        <td className="px-6 py-4">{lease.item?.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lease.quantity || 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(lease.lease_until)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewDetails(lease)}
                                    className="p-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    <Info size={16} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setConfirmReturn(lease)}
                                    className="p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                >
                                    <RotateCcw size={16} />
                                </motion.button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
