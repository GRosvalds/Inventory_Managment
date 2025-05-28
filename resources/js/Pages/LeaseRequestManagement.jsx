import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarLayout from "@/Components/SidebarLayout";
import Toast from '@/Components/Toast';
import LeaseRequestFilters from '@/Components/LeaseRequestManagement/LeaseRequestFilters';
import LeaseRequestsTable from '@/Components/LeaseRequestManagement/LeaseRequestsTable';
import LeaseRequestDetailsModal from '@/Components/LeaseRequestManagement/LeaseRequestDetailsModal';
import Pagination from '@/Components/Pagination/Pagination';

function LeaseRequestManagement() {
    const { auth } = usePage().props;
    const [leaseRequests, setLeaseRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [toast, setToast] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        perPage: 8
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchLeaseRequests = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get('/lease-requests', {
                params: { page, perPage: pagination.perPage }
            });

            setLeaseRequests(response.data.data);

                setPagination({
                    currentPage: response.data.current_page,
                    totalItems: response.data.total,
                    totalPages: response.data.last_page,
                    perPage: response.data.per_page
                });
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

    const handlePageChange = (pageNumber) => {
        fetchLeaseRequests(pageNumber);
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`/lease-requests/${id}/approve`);
            showToast('Lease request approved successfully');
            fetchLeaseRequests(pagination.currentPage);
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
            fetchLeaseRequests(pagination.currentPage);
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

                <LeaseRequestFilters
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-5 bg-blue-800 border-b flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h2 className="text-xl font-bold text-white">Lease Requests</h2>
                    </div>

                    <LeaseRequestsTable
                        filteredRequests={filteredRequests}
                        isLoading={isLoading}
                        openDetailsModal={openDetailsModal}
                        handleApprove={handleApprove}
                        handleReject={handleReject}
                    />
                </motion.div>

                {!isLoading && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.perPage}
                    />
                )}
            </div>

            <AnimatePresence>
                {isDetailsModalOpen && (
                    <LeaseRequestDetailsModal
                        isOpen={isDetailsModalOpen}
                        onClose={closeDetailsModal}
                        request={selectedRequest}
                        handleApprove={handleApprove}
                        handleReject={handleReject}
                    />
                )}
            </AnimatePresence>
        </SidebarLayout>
    );
}

export default LeaseRequestManagement;
