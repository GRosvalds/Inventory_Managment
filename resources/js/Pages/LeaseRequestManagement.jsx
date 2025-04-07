import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Filter, Clock, Calendar, User, Package, FileText } from 'lucide-react';
import SidebarLayout from "@/Components/SidebarLayout";

// Toast Component
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

function LeaseRequestManagement() {
    const { auth } = usePage().props;
    const [leaseRequests, setLeaseRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [toast, setToast] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchLeaseRequests = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/lease-requests');
            setLeaseRequests(response.data.data);
        } catch (error) {
            console.error('Error fetching lease requests:', error);
            showToast('Failed to load lease requests', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaseRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`/lease-requests/${id}/approve`);
            showToast('Lease request approved successfully');
            fetchLeaseRequests();
            if (isDetailsModalOpen) {
                setIsDetailsModalOpen(false);
            }
        } catch (error) {
            console.error('Error approving lease request:', error);
            showToast(error.response?.data?.error || 'Failed to approve request', 'error');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`/lease-requests/${id}/reject`);
            showToast('Lease request rejected');
            fetchLeaseRequests();
            if (isDetailsModalOpen) {
                setIsDetailsModalOpen(false);
            }
        } catch (error) {
            console.error('Error rejecting lease request:', error);
            showToast('Failed to reject request', 'error');
        }
    };

    const openDetailsModal = (request) => {
        setSelectedRequest(request);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
    };

    const filteredRequests = leaseRequests.filter(request => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'pending') return request.status_id === 1;
        if (statusFilter === 'approved') return request.status_id === 2;
        if (statusFilter === 'rejected') return request.status_id === 3;
        return true;
    });

    const getStatusBadge = (statusId) => {
        switch (statusId) {
            case 1:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                </span>;
            case 2:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" /> Approved
                </span>;
            case 3:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <X className="w-3 h-3 mr-1" /> Rejected
                </span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Unknown
                </span>;
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    return (
        <SidebarLayout>
            <Head title="Lease Request Management" />

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
                    <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">Lease Request Management</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-6 rounded-lg shadow-md mb-8"
                >
                    <div className="flex items-center mb-4">
                        <Filter size={20} className="text-blue-800 mr-2" />
                        <h2 className="text-xl font-semibold text-blue-800">Filter Requests</h2>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`py-2 px-4 rounded-lg border transition ${statusFilter === 'all' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            All Requests
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`py-2 px-4 rounded-lg border transition ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            <Clock size={16} className="inline mr-2" />
                            Pending
                        </button>
                        <button
                            onClick={() => setStatusFilter('approved')}
                            className={`py-2 px-4 rounded-lg border transition ${statusFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            <Check size={16} className="inline mr-2" />
                            Approved
                        </button>
                        <button
                            onClick={() => setStatusFilter('rejected')}
                            className={`py-2 px-4 rounded-lg border transition ${statusFilter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            <X size={16} className="inline mr-2" />
                            Rejected
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-5 bg-blue-800 border-b flex items-center">
                        <FileText size={20} className="text-white mr-2" />
                        <h2 className="text-xl font-bold text-white">Lease Requests</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-lg font-medium">No lease requests found</p>
                            <p className="text-sm">There are no lease requests matching your filter criteria.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">User</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Item</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Requested Until</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Requested On</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            {request.user?.name || 'Unknown User'}
                                        </td>
                                        <td className="py-4 px-4">
                                            {request.inventory_item?.name || 'Unknown Item'}
                                        </td>
                                        <td className="py-4 px-4">
                                            {new Date(request.requested_until).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            {getStatusBadge(request.status_id)}
                                        </td>
                                        <td className="py-4 px-4">
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex space-x-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => openDetailsModal(request)}
                                                    className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                                                >
                                                    Details
                                                </motion.button>

                                                {request.status_id === 1 && (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleApprove(request.id)}
                                                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                                        >
                                                            <Check size={16} />
                                                        </motion.button>

                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleReject(request.id)}
                                                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                                        >
                                                            <X size={16} />
                                                        </motion.button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {isDetailsModalOpen && selectedRequest && (
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
                                <button onClick={closeDetailsModal} className="text-white hover:text-gray-200 transition">
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
                                            <p><span className="font-medium text-gray-500">Name:</span> {selectedRequest.user?.name}</p>
                                            <p><span className="font-medium text-gray-500">Email:</span> {selectedRequest.user?.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-700 flex items-center">
                                            <Package size={18} className="mr-2" />
                                            Item Information
                                        </h4>
                                        <div className="mt-2 space-y-2">
                                            <p><span className="font-medium text-gray-500">Name:</span> {selectedRequest.inventory_item?.name}</p>
                                            <p><span className="font-medium text-gray-500">Category:</span> {selectedRequest.inventory_item?.category}</p>
                                            <p><span className="font-medium text-gray-500">Available Quantity:</span> {selectedRequest.inventory_item?.quantity}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-700 flex items-center">
                                        <Calendar size={18} className="mr-2" />
                                        Request Details
                                    </h4>
                                    <div className="mt-2 space-y-2">
                                        <p><span className="font-medium text-gray-500">Status:</span> {getStatusBadge(selectedRequest.status_id)}</p>
                                        <p><span className="font-medium text-gray-500">Requested On:</span> {new Date(selectedRequest.created_at).toLocaleString()}</p>
                                        <p><span className="font-medium text-gray-500">Requested Until:</span> {new Date(selectedRequest.requested_until).toLocaleDateString()}</p>
                                        {selectedRequest.approved_at && (
                                            <p><span className="font-medium text-gray-500">Approved/Rejected On:</span> {new Date(selectedRequest.approved_at).toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-700">Purpose</h4>
                                    <p className="mt-2 p-3 bg-gray-50 rounded-lg">{selectedRequest.purpose || 'No purpose provided'}</p>
                                </div>

                                {selectedRequest.status_id === 1 && (
                                    <div className="mt-8 flex justify-end space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleReject(selectedRequest.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md flex items-center"
                                        >
                                            <X size={16} className="mr-2" />
                                            Reject Request
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleApprove(selectedRequest.id)}
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
                )}
            </AnimatePresence>
        </SidebarLayout>
    );
}

export default LeaseRequestManagement;
