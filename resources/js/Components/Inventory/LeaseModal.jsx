import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const LeaseModal = ({ isOpen, onClose, onSubmit, leaseDetails, setLeaseDetails, users, maxQuantity }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg"
            >
                <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Lease Item</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
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
                                    onChange={(e) => setLeaseDetails({ ...leaseDetails, quantity: Math.min(Math.max(1, parseInt(e.target.value) || 1), maxQuantity) })}
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                    min="1"
                                    max={maxQuantity}
                                    required
                                />
                                <div className="mt-1 text-xs text-gray-500">
                                    Available: {maxQuantity}
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
                                Confirm Lease
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default LeaseModal;
