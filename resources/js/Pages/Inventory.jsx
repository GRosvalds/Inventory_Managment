import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Edit, Trash2, Archive, Search, Grid } from 'lucide-react';
import SidebarLayout from "@/Components/SidebarLayout";

const Toast = ({ message, type, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform z-[100] px-4 py-3 rounded-lg shadow-lg flex items-center ${
                type === 'success' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
            }`}
        >
            <span className="mr-2">
                {type === 'success' ? <Check size={18} /> : <X size={18} />}
            </span>
            <span>{message}</span>
            <button onClick={onClose} className="ml-3 hover:text-gray-200">
                <X size={16} />
            </button>
        </motion.div>
    );
};

function Inventory() {
    const { auth } = usePage().props;
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [newItem, setNewItem] = useState({ name: '', description: '', initial_quantity: 0, quantity: 0, category: '', estimated_price: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [leaseDetails, setLeaseDetails] = useState({ userId: '', leaseDuration: '', quantity: 1 });
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');

    const [stats, setStats] = useState({
        totalItems: 0,
        leasedItems: 0,
        missingItems: 0
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, [search, categoryFilter, availabilityFilter]);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const inventoryResponse = await axios.get('api/inventory', {
                params: { search, category: categoryFilter, availability: availabilityFilter }
            });

            const leaseResponse = await axios.get('/leases');
            const allLeases = leaseResponse.data;
            const leaseCount = allLeases.length;

            const itemsWithLeases = inventoryResponse.data.map(item => {
                return {
                    ...item,
                };
            });

            setItems(itemsWithLeases);

            const total = itemsWithLeases.length;
            const leased = leaseCount;
            const missing = itemsWithLeases.filter(item => item.quantity === 0).length;

            setStats({
                totalItems: total,
                leasedItems: leased,
                missingItems: missing
            });
        } catch (error) {
            console.error('Error fetching inventory:', error);
            showToast('Failed to load inventory items', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Failed to load user data', 'error');
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setNewItem(item);
            setIsEditing(true);
            setCurrentItemId(item.id);
        } else {
            setNewItem({ name: '', description: '', initial_quantity: 0, quantity: 0, category: '', estimated_price: 0 });
            setIsEditing(false);
            setCurrentItemId(null);
        }
        setIsModalOpen(true);
    };

    const openLeaseModal = (item) => {
        setCurrentItemId(item.id);
        setLeaseDetails({ userId: '', leaseDuration: '', quantity: 1 });
        setIsLeaseModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsLeaseModalOpen(false);
    };

    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await axios.put(`/api/inventory/${currentItemId}`, newItem);
                showToast('Item updated successfully');
            } else {
                await axios.post('/api/inventory', newItem);
                showToast('Item added successfully');
            }
            fetchItems();
            closeModal();
        } catch (error) {
            console.error('Error updating inventory:', error);
            showToast('Failed to update inventory', 'error');
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        const currentItem = items.find(item => item.id === currentItemId);
        const maxAvailable = currentItem ? currentItem.quantity : 1;
        const safeValue = Math.min(Math.max(1, value), maxAvailable);
        setLeaseDetails({ ...leaseDetails, quantity: safeValue });
    };

    const handleLeaseSubmit = async () => {
        try {
            const leaseData = {
                user_id: leaseDetails.userId,
                inventory_item_id: currentItemId,
                lease_until: leaseDetails.leaseDuration,
                quantity: leaseDetails.quantity,
            };

            await axios.post('/leases', leaseData);
            showToast('Item leased successfully');
            fetchItems();
            closeModal();
        } catch (error) {
            console.error('Error leasing item:', error);
            showToast('Failed to lease item', 'error');
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`/api/inventory/${id}`);
            showToast('Item deleted successfully');
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            showToast('Failed to delete item', 'error');
        }
    };

    const isItemLeasedByCurrentUser = (item) => {
        return item.users && Array.isArray(item.users) && item.users.some(user => user.id === auth.user.id);
    };

    const categories = ['Electronics', 'Furniture', 'Office Supplies', 'Tools', 'Other'];

    const statCards = [
        { title: 'Total Items', value: stats.totalItems, color: 'text-blue-800' },
        { title: 'Leased Items', value: stats.leasedItems, color: 'text-orange-500' },
        { title: 'Missing Items', value: stats.missingItems, color: 'text-red-500' }
    ];

    return (
        <SidebarLayout>
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <div className="container mx-auto">
                <motion.div
                    className="flex flex-col md:flex-row md:justify-between items-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">Inventory Management</h1>
                    <div className="flex space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openModal()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition duration-300 flex items-center"
                        >
                            <Plus size={18} className="mr-2" />
                            Add Item
                        </motion.button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {statCards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-800"
                        >
                            <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
                            <p className={`text-3xl font-bold ${card.color} mt-2`}>{card.value}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-md mb-8"
                >
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
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-5 bg-blue-800 border-b flex items-center">
                        <Grid size={20} className="text-white mr-2" />
                        <h2 className="text-xl font-bold text-white">Inventory Items</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Description</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Category</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Est. Price</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-500">
                                            No items found matching your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-4">{item.name}</td>
                                            <td className="py-4 px-4">{item.description}</td>
                                            <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        item.quantity === 0 ? 'bg-red-100 text-red-800' :
                                                            item.quantity <= 5 ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                    }`}>
                                                        {item.quantity}
                                                    </span>
                                            </td>
                                            <td className="py-4 px-4">{item.category}</td>
                                            <td className="py-4 px-4">${parseFloat(item.estimated_price).toFixed(2)}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => openModal(item)}
                                                        className="p-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition"
                                                    >
                                                        <Edit size={16} />
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this item?')) {
                                                                deleteItem(item.id);
                                                            }
                                                        }}
                                                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.button>

                                                    {!isItemLeasedByCurrentUser(item) && item.quantity > 0 && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => openLeaseModal(item)}
                                                            className="p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                                        >
                                                            <Archive size={16} />
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg"
                        >
                            <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
                                <button onClick={closeModal} className="text-white hover:text-gray-200 transition">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                            <input
                                                type="text"
                                                placeholder="Item Name"
                                                value={newItem.name}
                                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                placeholder="Description"
                                                value={newItem.description}
                                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                                rows="3"
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                                <input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={newItem.quantity}
                                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0, initial_quantity: parseInt(e.target.value) || 0})}
                                                    className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                                    min="0"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Price ($)</label>
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={newItem.estimated_price}
                                                    onChange={(e) => setNewItem({ ...newItem, estimated_price: parseFloat(e.target.value) || 0 })}
                                                    className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select
                                                value={newItem.category}
                                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            Cancel
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
                                        >
                                            {isEditing ? 'Update Item' : 'Add Item'}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isLeaseModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg"
                        >
                            <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Lease Item</h3>
                                <button onClick={closeModal} className="text-white hover:text-gray-200 transition">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                <form onSubmit={(e) => { e.preventDefault(); handleLeaseSubmit(); }}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To User</label>
                                            <select
                                                value={leaseDetails.userId}
                                                onChange={(e) => setLeaseDetails({ ...leaseDetails, userId: e.target.value })}
                                                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                                required
                                            >
                                                <option value="">Select User</option>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>{user.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                value={leaseDetails.quantity || 1}
                                                onChange={handleQuantityChange}
                                                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                                min="1"
                                                max={items.find(item => item.id === currentItemId)?.quantity || 1}
                                                required
                                            />
                                            <div className="mt-1 text-xs text-gray-500">
                                                Available: {items.find(item => item.id === currentItemId)?.quantity || 0}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Lease Until (Date)</label>
                                            <input
                                                type="date"
                                                value={leaseDetails.leaseDuration}
                                                onChange={(e) => setLeaseDetails({ ...leaseDetails, leaseDuration: e.target.value })}
                                                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            Cancel
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
                                        >
                                            Confirm Lease
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </SidebarLayout>
    );
}

export default Inventory;
