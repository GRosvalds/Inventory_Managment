import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';

function UserLeasedItems({ userId }) {
    const [leasedItems, setLeasedItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchLeasedItems();
    }, []);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, leasedItems]);

    const fetchLeasedItems = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/user/${userId}/leased-items`);
            setLeasedItems(response.data);
            setFilteredItems(response.data);
        } catch (error) {
            console.error('Error fetching leased items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (term) => {
        if (!term.trim()) {
            setFilteredItems(leasedItems);
            return;
        }

        const lowercasedTerm = term.toLowerCase();
        const filtered = leasedItems.filter(item =>
            item.name.toLowerCase().includes(lowercasedTerm) ||
            item.description.toLowerCase().includes(lowercasedTerm) ||
            item.category.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredItems(filtered);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedItems = [...filteredItems].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setFilteredItems(sortedItems);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return null;
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    return (
        <>
            <Head title="Leased Items" />
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-10 px-4 md:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                        <h1 className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">Your Leased Items</h1>
                        <p className="text-gray-600">View and manage all items you currently have on lease</p>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <div className="relative w-full md:w-96 mb-4 md:mb-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200"
                                    onClick={fetchLeasedItems}
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-16">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="mt-4 text-gray-500 text-lg">
                                    {searchTerm ? "No matching items found" : "You don't have any leased items yet"}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center">
                                                Name {getSortIcon('name')}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSort('quantity')}
                                        >
                                            <div className="flex items-center">
                                                Quantity {getSortIcon('quantity')}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSort('category')}
                                        >
                                            <div className="flex items-center">
                                                Category {getSortIcon('category')}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSort('estimated_price')}
                                        >
                                            <div className="flex items-center">
                                                Price {getSortIcon('estimated_price')}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leased On</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return By</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredItems.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs truncate">{item.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.quantity}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {item.category}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${parseFloat(item.estimated_price).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.pivot?.leased_at ? formatDate(item.pivot.leased_at) : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${new Date(item.pivot?.lease_until) < new Date() ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                                                    {formatDate(item.pivot?.lease_until)}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default UserLeasedItems;
