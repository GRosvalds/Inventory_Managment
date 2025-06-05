import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InventoryCheckDetailModal({ history, onClose, formatDate }) {
    const [activeTab, setActiveTab] = useState('details');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl"
            >
                <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">History Details</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 6l12 12M6 18L18 6" /></svg>
                    </button>
                </div>

                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'details'
                                ? 'border-b-2 border-blue-800 text-blue-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('raw')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'raw'
                                ? 'border-b-2 border-blue-800 text-blue-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Raw Data
                    </button>
                </div>

                {activeTab === 'details' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Action</h4>
                                    <div className="flex items-center">
                                        <span className="text-gray-900">
                                            {history && history.action ? (
                                                <span>{history.action}</span>
                                            ) : (
                                                <span>No action available</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                                    <div className="flex items-center">
                                        <span className="text-gray-900">{formatDate(history.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">Description</h4>
                                <p className="text-gray-900 whitespace-pre-line">{history.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'raw' && (
                    <div className="p-6">
                        <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                            {JSON.stringify(history, null, 2)}
                        </pre>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
