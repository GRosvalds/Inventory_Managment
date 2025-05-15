import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Calendar,
    Clock,
    Tag,
    DollarSign,
    Info,
    FileText,
    User,
    Mail,
    Package,
    Hash, AlertTriangle, CheckCircle
} from 'lucide-react';

export default function LeaseDetailsModal({ lease, onClose, formatDate }) {
    const [activeTab, setActiveTab] = useState('details');
    const isOverdue = new Date(lease.lease_until) < new Date();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-3xl"
            >
                <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Lease #{lease.id} - {lease.item?.name}</h3>
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
                        <Info size={16} className="inline mr-1" /> Lease Details
                    </button>
                    <button
                        onClick={() => setActiveTab('user')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'user'
                                ? 'border-b-2 border-blue-800 text-blue-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <User size={16} className="inline mr-1" /> User Information
                    </button>
                    <button
                        onClick={() => setActiveTab('item')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'item'
                                ? 'border-b-2 border-blue-800 text-blue-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Package size={16} className="inline mr-1" /> Item Information
                    </button>
                </div>

                {activeTab === 'details' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Lease ID</h4>
                                    <div className="flex items-center">
                                        <Hash size={16} className="mr-1 text-gray-500" />
                                        <p className="text-gray-900">{lease.id}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Lease Created</h4>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-1 text-gray-500" />
                                        <span className="text-gray-900">{formatDate(lease.created_at)}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                                    <div className="flex items-center">
                                        <Clock size={16} className="mr-1 text-gray-500" />
                                        <span className="text-gray-900">{formatDate(lease.updated_at)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">Lease Status</h4>
                                <div className={`flex items-center p-3 rounded-lg ${
                                    isOverdue ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
                                }`}>
                                    {isOverdue ? (
                                        <>
                                            <div className="rounded-full bg-red-200 p-2 mr-3">
                                                <AlertTriangle size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium">Overdue</p>
                                                <p className="text-sm">
                                                    This lease was due on {formatDate(lease.lease_until)}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="rounded-full bg-green-200 p-2 mr-3">
                                                <CheckCircle size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium">Active</p>
                                                <p className="text-sm">
                                                    Due on {formatDate(lease.lease_until)}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-1">Quantity Leased</p>
                                    <p className="font-medium">{lease.quantity || 1} item(s)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'user' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">User Name</h4>
                                    <div className="flex items-center">
                                        <User size={16} className="mr-1 text-gray-500" />
                                        <p className="text-gray-900">{lease.user?.name || 'Unknown'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                                    <div className="flex items-center">
                                        <Mail size={16} className="mr-1 text-gray-500" />
                                        <p className="text-gray-900">{lease.user?.email || 'Unknown'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">User ID</h4>
                                    <div className="flex items-center">
                                        <Hash size={16} className="mr-1 text-gray-500" />
                                        <p className="text-gray-900">{lease.user_id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">User History</h4>
                                <p className="text-sm text-gray-600">
                                    This section could show the user's lease history, account status, or other relevant information.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'item' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Item Name</h4>
                                    <p className="text-gray-900">{lease.item?.name || 'Unknown'}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                                    <p className="text-gray-900">{lease.item?.description || 'No description'}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                                    <div className="flex items-center">
                                        <Tag size={16} className="mr-1 text-gray-500" />
                                        <span className="text-gray-900">{lease.item?.category || 'Uncategorized'}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Estimated Value</h4>
                                    <div className="flex items-center">
                                        <DollarSign size={16} className="mr-1 text-gray-500" />
                                        <span className="text-gray-900">
                                            ${parseFloat(lease.item?.estimated_price || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">Item Specifications</h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Item ID:</span>
                                        <span className="font-medium">{lease.inventory_item_id}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Current Stock:</span>
                                        <span className="font-medium">{lease.item?.quantity || 0}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Added On:</span>
                                        <span className="font-medium">{formatDate(lease.item?.created_at)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
