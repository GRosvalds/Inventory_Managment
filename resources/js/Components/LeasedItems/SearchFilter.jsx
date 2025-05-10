import React from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';

export default function SearchFilter({ searchTerm, setSearchTerm, onRefresh }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative w-full md:w-96 mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-800 focus:border-blue-800"
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md flex items-center"
                onClick={onRefresh}
            >
                <RefreshCw size={16} className="mr-2" />
                Refresh
            </motion.button>
        </div>
    );
}
