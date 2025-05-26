import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Tag, DollarSign, Info, FileText, AlertCircle } from 'lucide-react';

export default function ItemDetailsModal({ item, onClose, formatDate }) {
    const [activeTab, setActiveTab] = useState('details');
    const [extendDays, setExtendDays] = useState(7);
    const [extendReason, setExtendReason] = useState('');

    const handleRequestExtension = () => {
        console.log('Extension requested:', {
            leaseId: item.id,
            additionalDays: extendDays,
            reason: extendReason,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-3xl"
            >
                <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{item.item.name}</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={20} />
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
                        <Info size={16} className="inline mr-1" /> Item Details
                    </button>
                    <button
                        onClick={() => setActiveTab('lease')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'lease'
                                ? 'border-b-2 border-blue-800 text-blue-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <FileText size={16} className="inline mr-1" /> Lease Information
                    </button>
                </div>

                {activeTab === 'details' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                                    <p className="text-gray-900">{item.item.description}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                                    <div className="flex items-center">
                                        <Tag size={16} className="mr-1 text-gray-500" />
                                        <span className="text-gray-900">{item.item.category}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Estimated Value</h4>
                                    <div className="flex items-center">
                                        <DollarSign size={16} className="mr-1 text-gray-500" />
                                        <span className="text-gray-900">{parseFloat(item.item.estimated_price).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">Item Specifications</h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Item Nr:</span>
                                        <span className="font-medium">{item.item.id}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Quantity Leased:</span>
                                        <span className="font-medium">{item.item.quantity || 1}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Current Status:</span>
                                        <span className="font-medium">Leased</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'lease' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Lease Nr</h4>
                                    <p className="text-gray-900">#{item.id}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Lease Due Date</h4>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-1 text-gray-500" />
                                        <span className={`${
                                            new Date(item.lease_until) < new Date()
                                                ? 'text-red-600 font-medium'
                                                : 'text-gray-900'}`}>
                                            {formatDate(item.lease_until)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Lease Status</h4>
                                    <div className="flex items-center">
                                        <Clock size={16} className="mr-1 text-gray-500" />
                                        <span className={`${
                                            new Date(item.lease_until) < new Date()
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }`}>
                                            {new Date(item.lease_until) < new Date() ? 'Overdue' : 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                                    <AlertCircle size={16} className="mr-1" />
                                    Request Lease Extension
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    Need more time? You can request to extend your lease period.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Days
                                        </label>
                                        <select
                                            value={extendDays}
                                            onChange={(e) => setExtendDays(parseInt(e.target.value))}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value={7}>7 days</option>
                                            <option value={14}>14 days</option>
                                            <option value={30}>30 days</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reason for Extension
                                        </label>
                                        <textarea
                                            value={extendReason}
                                            onChange={(e) => setExtendReason(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            rows={3}
                                            placeholder="Please explain why you need more time..."
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleRequestExtension}
                                        className="w-full px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition"
                                    >
                                        Request Extension
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
