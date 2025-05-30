import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutLeasedItems } from "@/Components/HeaderFooter.jsx";
import Toast from '@/Components/Toast';
import SearchFilter from '@/Components/LeasedItems/SearchFilter';
import LeasedItemsTable from '@/Components/LeasedItems/LeasedItemsTable';
import PendingLeasesTable from '@/components/UserPendingLeases/PendingLeasesTable';
import ConfirmReturnModal from '@/Components/LeasedItems/ConfirmReturnModal';
import ItemDetailsModal from '@/Components/LeasedItems/ItemDetailsModal';
import EmptyState from '@/Components/LeasedItems/EmptyState';
import Pagination from "@/Components/Pagination/Pagination.jsx";

function UserLeasedItems({ userId }) {
    const [activeTab, setActiveTab] = useState('active');
    const [leasedItems, setLeasedItems] = useState([]);
    const [pendingLeases, setPendingLeases] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [toast, setToast] = useState(null);
    const [confirmReturn, setConfirmReturn] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        perPage: 12
    });

    useEffect(() => {
        fetchLeasedItems();
        fetchPendingLeases();
    }, []);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, leasedItems]);

    const fetchLeasedItems = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/user/${userId}/leased-items`, {
                params: { page, perPage: pagination.perPage }
            });

            if (response.data.data) {
                setLeasedItems(response.data.data);
                setFilteredItems(response.data.data);

                setPagination({
                    currentPage: response.data.current_page,
                    totalItems: response.data.total,
                    totalPages: response.data.last_page,
                    perPage: response.data.per_page || pagination.perPage
                });
            } else {
                setLeasedItems(response.data);
                setFilteredItems(response.data);
            }
        } catch (error) {
            console.error('Error fetching leased items:', error);
            showToast('Failed to fetch leased items', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPendingLeases = async () => {
        try {
            const response = await axios.get(`/api/user/${userId}/pending-leases`);
            setPendingLeases(response.data);
        } catch (error) {
            console.error('Error fetching pending leases:', error);
            showToast('Failed to fetch pending leases', 'error');
        }
    };

    const handlePageChange = (pageNumber) => {
        fetchLeasedItems(pageNumber);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleReturnItem = async (leaseId) => {
        try {
            await axios.delete(`/leases/${leaseId}`);

            const returnedLease = leasedItems.find(lease => lease.id === leaseId);
            if (returnedLease) {
                const updatedItems = leasedItems.filter(lease => lease.id !== leaseId);
                setLeasedItems(updatedItems);
                setFilteredItems(updatedItems);
                showToast(`Item returned successfully`);
            }

            setConfirmReturn(null);
        } catch (error) {
            console.error('Error returning item:', error);
            showToast('Failed to return item', 'error');
        }
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setShowDetailsModal(true);
    };

    const handleSearch = (term) => {
        if (!term.trim()) {
            setFilteredItems(leasedItems);
            return;
        }

        const lowercasedTerm = term.toLowerCase();
        const filtered = leasedItems.filter(lease =>
            lease.item?.name.toLowerCase().includes(lowercasedTerm) ||
            lease.item?.description.toLowerCase().includes(lowercasedTerm) ||
            lease.item?.category.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredItems(filtered);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedItems = [...filteredItems].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setFilteredItems(sortedItems);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return null;
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    return (
        <LayoutLeasedItems>
            <div className="container mx-auto py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-6 bg-blue-800 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-white mb-2">Your Leased Items</h1>
                        <p className="text-blue-100">View and manage all items you currently have on lease or pending</p>
                    </div>

                    <div className="p-6">
                        <div className="mb-4 flex gap-2">
                            <button
                                className={`px-4 py-2 rounded ${activeTab === 'active' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                                onClick={() => setActiveTab('active')}
                            >
                                Active Leases
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${activeTab === 'pending' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                                onClick={() => setActiveTab('pending')}
                            >
                                Pending Requests
                            </button>
                        </div>

                        {activeTab === 'active' && (
                            <>
                                <SearchFilter
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    onRefresh={fetchLeasedItems}
                                />

                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                                    </div>
                                ) : filteredItems.length === 0 ? (
                                    <EmptyState searchTerm={searchTerm} />
                                ) : (
                                    <LeasedItemsTable
                                        filteredItems={filteredItems}
                                        handleSort={handleSort}
                                        getSortIcon={getSortIcon}
                                        formatDate={formatDate}
                                        setConfirmReturn={(id) => setConfirmReturn(id)}
                                        handleViewDetails={handleViewDetails}
                                    />
                                )}
                                {!isLoading && filteredItems.length > 0 && (
                                    <Pagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={pagination.totalItems}
                                        itemsPerPage={pagination.perPage}
                                    />
                                )}
                            </>
                        )}

                        {activeTab === 'pending' && (
                            <PendingLeasesTable userId={userId} showToast={showToast} />
                        )}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmReturn && (
                    <ConfirmReturnModal
                        confirmReturn={confirmReturn}
                        handleReturnItem={handleReturnItem}
                        setConfirmReturn={setConfirmReturn}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDetailsModal && selectedItem && (
                    <ItemDetailsModal
                        item={selectedItem}
                        onClose={() => setShowDetailsModal(false)}
                        formatDate={formatDate}
                    />
                )}
            </AnimatePresence>
        </LayoutLeasedItems>
    );
}

export default UserLeasedItems;
