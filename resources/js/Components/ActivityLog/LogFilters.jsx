import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw } from 'lucide-react';

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

    const handleDateFilterChange = (filter) => {
        const newDateFilter = filter;
        setDateFilter(newDateFilter);
        onFilter({ dateFilter: newDateFilter, actionFilter });
    };

    const handleActionFilterChange = (filter) => {
        const newActionFilter = filter;
        setActionFilter(newActionFilter);
        onFilter({ dateFilter, actionFilter: newActionFilter });
    };

    const handleReset = () => {
        setSearchTerm('');
        setDateFilter('all');
        setActionFilter('all');
        onFilter({ dateFilter: 'all', actionFilter: 'all' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
            <div className="flex items-center mb-4">
                <Filter size={20} className="text-blue-800 mr-2" />
                <h2 className="text-xl font-semibold text-blue-800">Filter Activity Logs</h2>
            </div>

            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by user, action, IP, or description..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <button
                    onClick={() => handleDateFilterChange('all')}
                    className={`py-2 px-4 rounded-lg border transition ${dateFilter === 'all' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    All Time
                </button>
                <button
                    onClick={() => handleDateFilterChange('today')}
                    className={`py-2 px-4 rounded-lg border transition ${dateFilter === 'today' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    Today
                </button>
                <button
                    onClick={() => handleDateFilterChange('week')}
                    className={`py-2 px-4 rounded-lg border transition ${dateFilter === 'week' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    This Week
                </button>
                <button
                    onClick={() => handleDateFilterChange('month')}
                    className={`py-2 px-4 rounded-lg border transition ${dateFilter === 'month' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    This Month
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
                <button
                    onClick={() => handleActionFilterChange('all')}
                    className={`py-2 px-4 rounded-lg border transition ${actionFilter === 'all' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    All Actions
                </button>
                <button
                    onClick={() => handleActionFilterChange('create')}
                    className={`py-2 px-4 rounded-lg border transition ${actionFilter === 'create' ? 'bg-purple-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    Create
                </button>
                <button
                    onClick={() => handleActionFilterChange('update')}
                    className={`py-2 px-4 rounded-lg border transition ${actionFilter === 'update' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    Update
                </button>
                <button
                    onClick={() => handleActionFilterChange('delete')}
                    className={`py-2 px-4 rounded-lg border transition ${actionFilter === 'delete' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    Delete
                </button>
                <button
                    onClick={() => handleActionFilterChange('visited')}
                    className={`py-2 px-4 rounded-lg border transition ${actionFilter === 'visited' ? 'bg-blue-300 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    Visited
                </button>
            </div>

            <div className="mt-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                >
                    <RefreshCw size={18} className="mr-2" />
                    Reset Filters
                </motion.button>
            </div>
        </motion.div>
    );
}

export default LogFilters;
