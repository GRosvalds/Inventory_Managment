// resources/js/Components/LeaseRequestModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { X, Check, AlertTriangle } from 'lucide-react';
import { usePage } from "@inertiajs/react";

export const Toast = ({ message, type, onClose }) => {
    // Toast component remains unchanged
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

function LeaseRequestModal({ isOpen, onClose, item }) {
    const { auth } = usePage().props;
    const [leaseDuration, setLeaseDuration] = useState(7);
    const [leasePurpose, setLeasePurpose] = useState('');
    const [quantity, setQuantity] = useState(1); // Add quantity state
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleLeaseRequest = async (e) => {
        e.preventDefault();

        // Validate quantity
        if (quantity > item.quantity) {
            showToast(`Cannot request more than available quantity (${item.quantity})`, 'error');
            return;
        }

        try {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + parseInt(leaseDuration));
            const formattedDate = endDate.toISOString().split('T')[0];

            await axios.post(`/lease-requests`, {
                user_id: auth.user.id,
                inventory_id: item.id,
                quantity: quantity,
                requested_until: formattedDate,
                purpose: leasePurpose
            });

            showToast('Lease request submitted successfully');
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error('Error submitting lease request:', error);
            showToast('Failed to submit lease request: ' +
                (error.response?.data?.error || 'Unknown error'), 'error');
        }
    };

    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    return (
        <>
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
                >
                    <div className="p-4 bg-blue-800 border-b flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Request to Lease Item</h3>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold">{item?.name}</h4>
                            <p className="text-sm text-gray-500">Category: {item?.category}</p>
                            <p className="text-sm text-gray-500">Description: {item?.description}</p>
                            <p className="text-sm text-gray-500">Available Quantity: {item?.quantity}</p>
                        </div>

                        <form onSubmit={handleLeaseRequest}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        min="1"
                                        max={item?.quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="p-3 border rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                        required
                                    />
                                    {quantity > item?.quantity && (
                                        <div className="ml-2 text-red-500 flex items-center">
                                            <AlertTriangle size={16} className="mr-1" />
                                        </div>
                                    )}
                                </div>
                                {quantity > item?.quantity && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Cannot exceed available quantity
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lease Duration (days)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="90"
                                    value={leaseDuration}
                                    onChange={(e) => setLeaseDuration(e.target.value)}
                                    className="p-3 border rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                <textarea
                                    value={leasePurpose}
                                    onChange={(e) => setLeasePurpose(e.target.value)}
                                    className="p-3 border rounded-lg shadow-sm w-full focus:ring-blue-800 focus:border-blue-800"
                                    rows="3"
                                    placeholder="Explain why you need this item..."
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition mt-4 shadow-md"
                                disabled={quantity > item?.quantity}
                            >
                                Submit Request
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default LeaseRequestModal;
