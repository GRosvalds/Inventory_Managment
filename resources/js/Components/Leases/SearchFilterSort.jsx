import React from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Filter } from 'lucide-react';

export default function SearchFilterSort({
                                             searchTerm,
                                             setSearchTerm,
                                             statusFilter,
                                             setStatusFilter,
                                             onRefresh
                                         }) {
    return (
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="relative w-full lg:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search leases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-800 focus:border-blue-800"
                    />
                </div>

                <div className="relative w-full lg:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter size={18} className="text-gray-400" />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-800 focus:border-blue-800"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center"
                onClick={onRefresh}
            >
                <RefreshCw size={16} className="mr-2" />
                Refresh
            </motion.button>
        </div>
    );
}
