import React, { useState } from 'react';
import { motion } from 'framer-motion';

function BasketModal({ isOpen, onClose, basketItems, removeFromBasket, onRequestLease }) {
    const [leaseDuration, setLeaseDuration] = useState(7);
    const [leasePurpose, setLeasePurpose] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onRequestLease(basketItems, { duration: leaseDuration, purpose: leasePurpose });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
                <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-blue-800">Your Basket</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {basketItems.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Your basket is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {basketItems.map(item => (
                                <div key={item.id} className="flex border-b pb-4">
                                    <div className="h-20 w-20 bg-gray-200 rounded-md mr-4 flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-md" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromBasket(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {basketItems.length > 0 && (
                    <div className="p-4 border-t">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lease Duration (days)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="90"
                                    value={leaseDuration}
                                    onChange={(e) => setLeaseDuration(parseInt(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Purpose/Notes
                                </label>
                                <textarea
                                    value={leasePurpose}
                                    onChange={(e) => setLeasePurpose(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Explain why you need these items..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Request Lease for All Items
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default BasketModal;
