import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from "@/Components/Pagination/Pagination.jsx";
import PendingLeasesEmpty from './PendingLeasesEmpty';

function PendingLeasesTable({ userId, showToast }) {
    const [pendingLeases, setPendingLeases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        perPage: 12
    });

    useEffect(() => {
        fetchPendingLeases();
    }, []);

    const fetchPendingLeases = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/user/${userId}/pending-leases`, {
                params: { page, perPage: pagination.perPage }
            });
            if (response.data.data) {
                setPendingLeases(response.data.data);
                setPagination({
                    currentPage: response.data.current_page,
                    totalItems: response.data.total,
                    totalPages: response.data.last_page,
                    perPage: response.data.per_page || pagination.perPage
                });
            } else {
                setPendingLeases(response.data);
            }
        } catch {
            showToast('Failed to fetch pending leases', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (leaseId) => {
        try {
            await axios.delete(`/lease-requests/${leaseId}`);
            setPendingLeases(prev => prev.filter(lease => lease.id !== leaseId));
            showToast('Lease request cancelled');
        } catch (error) {
            showToast('Failed to cancel', 'error');
        }
    };

    const handlePageChange = (pageNumber) => {
        fetchPendingLeases(pageNumber);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (pendingLeases.length === 0) {
        return <PendingLeasesEmpty />;
    }

    return (
        <>
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requested Until</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {pendingLeases.map((lease) => (
                        <tr key={lease.id}>
                            <td className="px-4 py-2">{lease.inventory_item?.name || 'N/A'}</td>
                            <td className="px-4 py-2">{lease.quantity}</td>
                            <td className="px-4 py-2">{formatDate(lease.requested_until)}</td>
                            <td className="px-4 py-2">{lease.purpose || '-'}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleCancel(lease.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden space-y-4">
                {pendingLeases.map((lease) => (
                    <div key={lease.id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span className="font-semibold text-blue-800">{lease.inventory_item?.name || 'N/A'}</span>
                            <button
                                onClick={() => handleCancel(lease.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="text-sm text-gray-600">Quantity: <span className="font-medium">{lease.quantity}</span></div>
                        <div className="text-sm text-gray-600">Until: <span className="font-medium">{formatDate(lease.requested_until)}</span></div>
                        <div className="text-sm text-gray-600">Purpose: <span className="font-medium">{lease.purpose || '-'}</span></div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.perPage}
            />
        </>
    );
}

export default PendingLeasesTable;
