import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AllLeasesTable({
                                           leases,
                                           handleSort,
                                           getSortIcon,
                                           formatDate,
                                           handleViewDetails
                                       }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('user.name')}>
                        User {getSortIcon('user.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('item.name')}>
                        Item {getSortIcon('item.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('item.category')}>
                        Category {getSortIcon('item.category')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('quantity')}>
                        Quantity {getSortIcon('quantity')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lease_until')}>
                        Due Date {getSortIcon('lease_until')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {leases.map((lease) => {
                    const isOverdue = new Date(lease.lease_until) < new Date();

                    return (
                        <tr key={`lease-${lease.id}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{lease.user?.name || 'Unknown User'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{lease.item?.name || 'Unknown Item'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{lease.item?.category || 'Uncategorized'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{lease.quantity || 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(lease.lease_until)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {isOverdue ? (
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            <AlertTriangle size={14} className="mr-1" /> Overdue
                                        </span>
                                ) : (
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            <CheckCircle size={14} className="mr-1" /> Active
                                        </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewDetails(lease)}
                                    className="p-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    <Info size={16} />
                                </motion.button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
