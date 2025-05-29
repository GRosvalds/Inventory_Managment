import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, AlertCircle, Clock } from 'lucide-react';

function ActivityLogTable({ logs, isLoading, onViewUser }) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No activity logs found</h3>
                <p className="mt-1 text-sm text-gray-500">No logs match your current filters.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UserCircle className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => onViewUser(log.user)}>
                                        {log.user?.name || 'Unknown User'}
                                    </div>
                                    <div className="text-xs text-gray-500">{log.user?.roles[0]?.name || 'N/A'}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${getActionColor(log.action)}`}>
                                    {log.action}
                                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {log.ip_address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex items-center">
                                <Clock size={14} className="mr-1 text-gray-400" />
                                <span>{formatDate(log.created_at)}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => onViewUser(log.user, log)}
                            >
                                View details
                            </motion.button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function getActionColor(action) {
    if (!action) return 'bg-gray-100 text-gray-800';

    switch (action.toLowerCase()) {
        case 'login':
            return 'bg-green-100 text-green-800';
        case 'logout':
            return 'bg-blue-100 text-blue-800';
        case 'create':
            return 'bg-purple-100 text-purple-800';
        case 'update':
            return 'bg-yellow-100 text-yellow-800';
        case 'delete':
            return 'bg-red-100 text-red-800';
        case 'view':
            return 'bg-blue-50 text-blue-600';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
}

export default ActivityLogTable;
