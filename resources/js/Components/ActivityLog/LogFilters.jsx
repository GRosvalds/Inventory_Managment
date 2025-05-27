import React from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';

function LogFilters({
                        searchTerm,
                        setSearchTerm,
                        dateFilter,
                        setDateFilter,
                        actionFilter,
                        setActionFilter,
                        onSearch,
                        onFilter
                    }) {
    const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
            onSearch();
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by user, action, or IP..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <select
                        value={dateFilter}
                        onChange={(e) => {
                            setDateFilter(e.target.value);
                            onFilter();
                        }}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>

                    <select
                        value={actionFilter}
                        onChange={(e) => {
                            setActionFilter(e.target.value);
                            onFilter();
                        }}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Actions</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="create">Create</option>
                        <option value="update">Update</option>
                        <option value="delete">Delete</option>
                        <option value="visited">Visited</option>
                    </select>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setSearchTerm('');
                            setDateFilter('all');
                            setActionFilter('all');
                            onFilter();
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                    >
                        <RefreshCw size={18} className="mr-2" />
                        Reset
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default LogFilters;
