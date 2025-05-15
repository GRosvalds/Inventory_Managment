import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const ItemModal = ({ isOpen, onClose, onSubmit, newItem, setNewItem, isEditing, categories = [] }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg"
                >
                    <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
                        <button onClick={onClose} className="text-white hover:text-gray-200 transition">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
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
                                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0, initial_quantity: parseInt(e.target.value) || 0 })}
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
                                    onClick={onClose}
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
        </AnimatePresence>
    );
};

export default ItemModal;
