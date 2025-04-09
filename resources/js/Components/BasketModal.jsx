import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Check, AlertTriangle } from 'lucide-react';

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

function BasketModal({ isOpen, onClose, basketItems, removeFromBasket, onRequestLease }) {
    const [leaseDuration, setLeaseDuration] = useState(7);
    const [leasePurpose, setLeasePurpose] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState(null);
    const [itemQuantities, setItemQuantities] = useState({}); // Track quantities for each item
    const itemsPerPage = 3;

    useEffect(() => {
        const quantities = {};
        basketItems.forEach(item => {
            quantities[item.id] = quantities[item.id] || 1;
        });
        setItemQuantities(quantities);
    }, [basketItems]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = basketItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(basketItems.length / itemsPerPage);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleQuantityChange = (itemId, quantity) => {
        setItemQuantities(prev => ({
            ...prev,
            [itemId]: quantity
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validQuantities = basketItems.every(item =>
            itemQuantities[item.id] > 0 && itemQuantities[item.id] <= item.quantity
        );

        if (!validQuantities) {
            showToast('Please check item quantities', 'error');
            return;
        }

        onRequestLease(basketItems, {
            duration: leaseDuration,
            purpose: leasePurpose,
            quantity: itemQuantities
        });

        showToast('Lease requests submitted successfully');
    };

    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: i => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.1, duration: 0.3 }
        })
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
                    className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex"
                >
                    <div className="w-64 bg-gray-100 p-4 border-r border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Options</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select className="w-full p-2 border border-gray-300 rounded focus:ring-blue-800 focus:border-blue-800">
                                    <option value="">All Categories</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="furniture">Furniture</option>
                                    <option value="office">Office Supplies</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Availability
                                </label>
                                <select className="w-full p-2 border border-gray-300 rounded focus:ring-blue-800 focus:border-blue-800">
                                    <option value="">All Items</option>
                                    <option value="available">Available Now</option>
                                    <option value="limited">Limited Stock</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button className="w-full px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition flex items-center justify-center">
                                    <Filter size={16} className="mr-2" />
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="p-4 bg-blue-800 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Your Basket</h3>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-grow max-h-[calc(90vh-200px)]">
                            {basketItems.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">Your basket is empty</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {currentItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            custom={index}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="flex items-center border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition bg-white"
                                        >
                                            <div className="h-24 w-24 bg-gray-200 rounded-md mr-4 flex-shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-md" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-medium text-blue-800">{item.name}</h4>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                                <div className="mt-1 flex items-center text-sm">
                                                    <span className="text-orange-500 font-medium">Available: {item.quantity}</span>
                                                </div>

                                                <div className="mt-2 flex items-center">
                                                    <label className="text-sm text-gray-600 mr-2">Quantity:</label>
                                                    <div className="relative w-24">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.quantity}
                                                            value={itemQuantities[item.id] || 1}
                                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-blue-800 focus:border-blue-800"
                                                        />
                                                        {(itemQuantities[item.id] || 1) > item.quantity && (
                                                            <div className="absolute right-0 top-0 h-full flex items-center pr-1">
                                                                <AlertTriangle size={12} className="text-red-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {(itemQuantities[item.id] || 1) > item.quantity && (
                                                        <span className="ml-2 text-red-500 text-xs">Exceeds available quantity</span>
                                                    )}
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    removeFromBasket(item.id);
                                                    showToast(`${item.name} removed from basket`);
                                                }}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {basketItems.length > itemsPerPage && (
                                <div className="flex justify-center mt-6 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-800 text-white hover:bg-blue-900'}`}
                                    >
                                        &laquo;
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-800 text-white hover:bg-blue-900'}`}
                                    >
                                        &raquo;
                                    </button>
                                </div>
                            )}
                        </div>

                        {basketItems.length > 0 && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Lease Duration (days)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="90"
                                                value={leaseDuration}
                                                onChange={(e) => setLeaseDuration(parseInt(e.target.value))}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-800 focus:border-blue-800"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Purpose/Notes
                                            </label>
                                            <textarea
                                                value={leasePurpose}
                                                onChange={(e) => setLeasePurpose(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-800 focus:border-blue-800"
                                                rows="3"
                                                placeholder="Explain why you need these items..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition shadow-md"
                                        >
                                            Request Lease for All Items
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default BasketModal;
