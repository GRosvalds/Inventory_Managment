import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileText, Check, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

function LeaseRequestsTable({ filteredRequests, isLoading, openDetailsModal, handleApprove, handleReject }) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (filteredRequests.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No lease requests found</p>
                <p className="text-sm">There are no lease requests matching your filter criteria.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">User</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Item</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Requested Until</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Requested On</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                            {request.user?.name || 'Unknown User'}
                        </td>
                        <td className="py-4 px-4">
                            {request.inventory_item?.name || 'Unknown Item'}
                        </td>
                        <td className="py-4 px-4">
                            {new Date(request.requested_until).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                            <StatusBadge statusId={request.status_id} />
                        </td>
                        <td className="py-4 px-4">
                            {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                            <div className="flex space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => openDetailsModal(request)}
                                    className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                                >
                                    Details
                                </motion.button>

                                {request.status_id === 1 && (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleApprove(request.id)}
                                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                        >
                                            <Check size={16} />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleReject(request.id)}
                                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                        >
                                            <X size={16} />
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default LeaseRequestsTable;
