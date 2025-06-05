import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarLayout from "@/Components/Sidebar/SidebarLayout.jsx";
import Toast from '@/Components/Toast';
import {
    InventoryCheckDetailModal
} from '@/Components/InventoryCheckHistory/InventoryCheckDetailModal';
import Pagination from '@/Components/Pagination/Pagination';
import axios from 'axios';

function InventoryCheckHistory() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const fetchLogs = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get('/inventory-check-history', {
                params: { page, perPage: pagination.perPage }
            });
            setLogs(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                totalItems: response.data.total,
                totalPages: response.data.last_page,
                perPage: response.data.per_page
            });
        } catch (error) {
            showToast('Failed to load inventory check history', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handlePageChange = (pageNumber) => {
        fetchLogs(pageNumber);
    };

    const openModal = (log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Simple date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString();
    };

    return (
        <SidebarLayout>
            <Head title="Inventory Check History" />

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
                    <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">Inventory Check History</h1>
                </motion.div>

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
                        <h2 className="text-xl font-bold text-white">Check History</h2>
                    </div>
                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-800"></div>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">{formatDate(log.created_at)}</td>
                                        <td className="px-4 py-2 truncate max-w-xs">{log.description}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                className="text-blue-700 hover:underline font-medium"
                                                onClick={() => openModal(log)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                        {!isLoading && logs.length === 0 && (
                            <div className="text-center text-gray-500 py-8">No inventory check history found.</div>
                        )}
                    </div>
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
                {isModalOpen && selectedLog && (
                    <InventoryCheckDetailModal
                        history={selectedLog}
                        onClose={closeModal}
                        formatDate={formatDate}
                    />
                )}
            </AnimatePresence>
        </SidebarLayout>
    );
}

export default InventoryCheckHistory;
