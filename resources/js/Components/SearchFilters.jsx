import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';

function SearchFilters({ onFilter }) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [availability, setAvailability] = React.useState('');

    const handleFilter = () => {
        onFilter({
            search: searchTerm,
            category: category,
            availability: availability
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6"
        >
            <h2 className="text-lg font-semibold text-blue-800 mb-4">Search & Filter</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                <div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800"
                    >
                        <option value="">All Categories</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                        <option value="office">Office Supplies</option>
                    </select>
                </div>

                <div>
                    <div className="flex space-x-2">
                        <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800"
                        >
                            <option value="">All Items</option>
                            <option value="available">Available Now</option>
                            <option value="limited">Limited Stock</option>
                        </select>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleFilter}
                            className="px-4 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg flex items-center justify-center"
                        >
                            <Filter size={18} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default SearchFilters;
