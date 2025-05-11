import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutLeasedItems } from "@/Components/HeaderFooter.jsx";
import Toast from '@/Components/Toast';
import SearchFilter from '@/Components/LeasedItems/SearchFilter';
import LeasedItemsTable from '@/Components/LeasedItems/LeasedItemsTable';
import ConfirmReturnModal from '@/Components/LeasedItems/ConfirmReturnModal';
import ItemDetailsModal from '@/Components/LeasedItems/ItemDetailsModal';
import EmptyState from '@/Components/LeasedItems/EmptyState';

function UserLeasedItems({ userId }) {
    const [leasedItems, setLeasedItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [toast, setToast] = useState(null);
    const [confirmReturn, setConfirmReturn] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchLeasedItems();
    }, []);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, leasedItems]);

    const fetchLeasedItems = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/user/${userId}/leased-items`);
            setLeasedItems(response.data);
            setFilteredItems(response.data);
        } catch (error) {
            console.error('Error fetching leased items:', error);
            showToast('Failed to fetch leased items', 'error');
        } finally {
            setIsLoading(false);
        }
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
                        <p className="text-blue-100">View and manage all items you currently have on lease</p>
                    </div>

                    <div className="p-6">
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
