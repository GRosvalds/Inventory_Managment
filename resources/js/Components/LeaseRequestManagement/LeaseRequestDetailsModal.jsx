import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Package, Calendar, Check } from 'lucide-react';
import StatusBadge from './StatusBadge';

function LeaseRequestDetailsModal({ isOpen, onClose, request, handleApprove, handleReject }) {
    if (!isOpen || !request) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden"
            >
                <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Lease Request Details</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-700 flex items-center">
                                <User size={18} className="mr-2" />
                                User Information
                            </h4>
                            <div className="mt-2 space-y-2">
                                <p><span className="font-medium text-gray-500">Name:</span> {request.user?.name}</p>
                                <p><span className="font-medium text-gray-500">Email:</span> {request.user?.email}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-700 flex items-center">
                                <Package size={18} className="mr-2" />
                                Item Information
                            </h4>
                            <div className="mt-2 space-y-2">
                                <p><span className="font-medium text-gray-500">Name:</span> {request.inventory_item?.name}</p>
                                <p><span className="font-medium text-gray-500">Category:</span> {request.inventory_item?.category}</p>
                                <p><span className="font-medium text-gray-500">Available Quantity:</span> {request.inventory_item?.quantity}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 flex items-center">
                            <Calendar size={18} className="mr-2" />
                            Request Details
                        </h4>
                        <div className="mt-2 space-y-2">
                            <p><span className="font-medium text-gray-500">Status:</span> <StatusBadge statusId={request.status_id} /></p>
                            <p><span className="font-medium text-gray-500">Quantity:</span> {request.quantity}</p>
                            <p><span className="font-medium text-gray-500">Requested On:</span> {new Date(request.created_at).toLocaleString()}</p>
                            <p><span className="font-medium text-gray-500">Requested Until:</span> {new Date(request.requested_until).toLocaleDateString()}</p>
                            {request.approved_at && (
                                <p><span className="font-medium text-gray-500">Approved/Rejected On:</span> {new Date(request.approved_at).toLocaleString()}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-700">Purpose</h4>
                        <p className="mt-2 p-3 bg-gray-50 rounded-lg">{request.purpose || 'No purpose provided'}</p>
                    </div>

                    {request.status_id === 1 && (
                        <div className="mt-8 flex justify-end space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleReject(request.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md flex items-center"
                            >
                                <X size={16} className="mr-2" />
                                Reject Request
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleApprove(request.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-md flex items-center"
                            >
                                <Check size={16} className="mr-2" />
                                Approve Request
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default LeaseRequestDetailsModal;
