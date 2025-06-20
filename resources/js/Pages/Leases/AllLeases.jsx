import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarLayout from "@/Components/Sidebar/SidebarLayout.jsx";
import Toast from '@/Components/Toast';
import SearchFilterSort from '@/Components/Leases/SearchFilterSort';
import AllLeasesTable from '@/Components/Leases/AllLeasesTable';
import LeaseDetailsModal from '@/Components/Leases/LeaseDetailsModal';
import EmptyState from '@/Components/Leases/EmptyState';
import Pagination from "@/Components/Pagination/Pagination.jsx";

function AllLeases() {
    const [leases, setLeases] = useState([]);
    const [filteredLeases, setFilteredLeases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [toast, setToast] = useState(null);
    const [selectedLease, setSelectedLease] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        perPage: 8
    });

    useEffect(() => {
        fetchLeases();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [searchTerm, statusFilter, leases]);

    const fetchLeases = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get('/leases', {
                params: { page, perPage: pagination.perPage }
            });

            if (response.data.data) {
                setLeases(response.data.data);
                setPagination({
                    currentPage: response.data.current_page,
                    totalItems: response.data.total,
                    totalPages: response.data.last_page,
                    perPage: response.data.per_page
                });
            } else {
                setLeases(response.data);
                setFilteredLeases(response.data);
            }
        } catch (error) {
            console.error('Error fetching leases:', error);
            showToast('Failed to fetch leases', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleViewDetails = (lease) => {
        setSelectedLease(lease);
        setShowDetailsModal(true);
    };

    const handleFilter = () => {
        let filtered = [...leases];

        if (statusFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(lease => {
                const leaseDate = new Date(lease.lease_until);
                return statusFilter === 'active' ? leaseDate >= now : leaseDate < now;
            });
        }

        if (searchTerm.trim()) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(lease =>
                lease.user?.name?.toLowerCase().includes(lowercasedTerm) ||
                lease.item?.name?.toLowerCase().includes(lowercasedTerm) ||
                lease.item?.category?.toLowerCase().includes(lowercasedTerm) ||
                lease.lease_until?.toLowerCase().includes(lowercasedTerm)
            );
        }

        setFilteredLeases(filtered);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedLeases = [...filteredLeases].sort((a, b) => {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!a[parent] || !b[parent]) return 0;

                if (a[parent][child] < b[parent][child]) return direction === 'ascending' ? -1 : 1;
                if (a[parent][child] > b[parent][child]) return direction === 'ascending' ? 1 : -1;
                return 0;
            }

            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });

        setFilteredLeases(sortedLeases);
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

    const handlePageChange = (pageNumber) => {
        fetchLeases(pageNumber);
    };

    return (
        <SidebarLayout>
            <Head title="All Leases" />
            <div className="container mx-auto py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-6 bg-blue-800 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-white mb-2">All System Leases</h1>
                        <p className="text-blue-100">Manage and view all item leases across the system</p>
                    </div>

                    <div className="p-6">
                        <SearchFilterSort
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            onRefresh={fetchLeases}
                        />

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                            </div>
                        ) : filteredLeases.length === 0 ? (
                            <EmptyState searchTerm={searchTerm} />
                        ) : (
                            <AllLeasesTable
                                leases={filteredLeases}
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                formatDate={formatDate}
                                handleViewDetails={handleViewDetails}
                            />
                        )}
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            totalItems={pagination.totalItems}
                            itemsPerPage={pagination.perPage}
                        />
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
                {showDetailsModal && selectedLease && (
                    <LeaseDetailsModal
                        lease={selectedLease}
                        onClose={() => setShowDetailsModal(false)}
                        formatDate={formatDate}
                    />
                )}
            </AnimatePresence>
        </SidebarLayout>
    );
}

export default AllLeases;
