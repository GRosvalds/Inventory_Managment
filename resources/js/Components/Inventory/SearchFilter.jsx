import React from 'react';
import { Search } from 'lucide-react';

const SearchFilter = ({ search, setSearch, categoryFilter, setCategoryFilter, availabilityFilter, setAvailabilityFilter }) => {
    const categories = ['Electronics', 'Furniture', 'Office Supplies', 'Tools', 'Other'];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <Search size={20} className="mr-2" />
                Search & Filter
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800 w-full"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800 w-full"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                    <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800 w-full"
                    >
                        <option value="">All Items</option>
                        <option value="available">In Stock</option>
                        <option value="limited">Limited Stock</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
