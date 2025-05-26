import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Clock, Check, X } from 'lucide-react';

function LeaseRequestFilters({ statusFilter, setStatusFilter }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
            <div className="flex items-center mb-4">
                <Filter size={20} className="text-blue-800 mr-2" />
                <h2 className="text-xl font-semibold text-blue-800">Filter Requests</h2>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`py-2 px-4 rounded-lg border transition ${statusFilter === 'all' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    All Requests
                </button>
                <button
                    onClick={() => setStatusFilter('pending')}
                    className={`py-2 px-4 rounded-lg border transition ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    <Clock size={16} className="inline mr-2" />
                    Pending
                </button>
                <button
                    onClick={() => setStatusFilter('approved')}
                    className={`py-2 px-4 rounded-lg border transition ${statusFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    <Check size={16} className="inline mr-2" />
                    Approved
                </button>
                <button
                    onClick={() => setStatusFilter('rejected')}
                    className={`py-2 px-4 rounded-lg border transition ${statusFilter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    <X size={16} className="inline mr-2" />
                    Rejected
                </button>
            </div>
        </motion.div>
    );
}

export default LeaseRequestFilters;
