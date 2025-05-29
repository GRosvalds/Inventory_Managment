import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Layout } from "@/Components/HeaderFooter.jsx";
import Toast from "@/Components/Toast";
import ActivityLogTabs from '@/Components/ActivityLog/ActivityLogTabs';
import ActivityLogTable from '@/Components/ActivityLog/ActivityLogTable';
import ActiveUsersSection from '@/Components/ActivityLog/ActiveUsersSection';
import LogFilters from '@/Components/ActivityLog/LogFilters';
import UserInfoModal from '@/Components/ActivityLog/UserInfoModal';
import ModernPagination from '@/Components/Pagination/ModernPagination';

function UserActivityLog() {
    const [activeTab, setActiveTab] = useState('users');
    const [logs, setLogs] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [actionFilter, setActionFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [userIpAddress, setUserIpAddress] = useState(null);

    const [selectedLogInfo, setSelectedLogInfo] = useState({
        description: null,
        action: null,
        id: null
    });

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

    useEffect(() => {
        fetchLogs();
        fetchActiveUsers();

        const interval = setInterval(() => {
            fetchActiveUsers();
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [activeTab]);

    const fetchLogs = async (page = 1, filters = {}) => {
        setIsLoading(true);
        try {
            const response = await axios.get('/activity-logs', {
                params: {
                    page,
                    perPage: pagination.perPage,
                    userType: activeTab,
                    search: searchTerm,
                    dateFilter: filters.dateFilter || dateFilter,
                    actionFilter: filters.actionFilter || actionFilter
                }
            });

            setLogs(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                totalItems: response.data.total,
                totalPages: response.data.last_page,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            showToast('Failed to load activity logs', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchActiveUsers = async () => {
        try {
            const response = await axios.get('/api/active-users', {
                params: { userType: activeTab }
            });
            setActiveUsers(response.data);
        } catch (error) {
            console.error('Error fetching active users:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        fetchLogs(pageNumber);
    };

    const handleSearch = () => {
        fetchLogs(1);
    };

    const handleFilter = ({ dateFilter: newDateFilter, actionFilter: newActionFilter } = {}) => {
        fetchLogs(1, {
            dateFilter: newDateFilter,
            actionFilter: newActionFilter
        });
    };

    const handleViewUser = (user, log = null) => {
        let selectedLog = log;

        if (!selectedLog) {
            const userLogs = logs.filter(log => log.user?.id === user.id);
            selectedLog = userLogs.sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            )[0];
        }

        setSelectedUser(user);
        setUserIpAddress(selectedLog?.ip_address || null);
        setSelectedLogInfo({
            description: selectedLog?.description || null,
            action: selectedLog?.action || null,
            id: selectedLog?.id || null
        });
        setIsUserModalOpen(true);
    };

    return (
        <Layout>
            <Head title="User Activity Log" />

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <div className="container mx-auto py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <div className="p-6 bg-blue-800 border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-white mb-2">User Activity Log</h1>
                            <p className="text-blue-100">Monitor user activity and system events</p>
                        </div>

                        <div className="p-6">
                            <ActivityLogTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />

                            <div className="mt-6">
                                <LogFilters
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    dateFilter={dateFilter}
                                    setDateFilter={setDateFilter}
                                    actionFilter={actionFilter}
                                    setActionFilter={setActionFilter}
                                    onSearch={handleSearch}
                                    onFilter={handleFilter}
                                />
                            </div>

                            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-3">
                                    <ActivityLogTable
                                        logs={logs}
                                        isLoading={isLoading}
                                        onViewUser={handleViewUser}
                                    />

                                    {!isLoading && logs.length > 0 && (
                                        <div className="mt-6">
                                            <ModernPagination
                                                currentPage={pagination.currentPage}
                                                totalPages={pagination.totalPages}
                                                onPageChange={handlePageChange}
                                                totalItems={pagination.totalItems}
                                                itemsPerPage={pagination.perPage}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="lg:col-span-1">
                                    <ActiveUsersSection
                                        activeUsers={activeUsers}
                                        userType={activeTab}
                                        onViewUser={handleViewUser}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isUserModalOpen && selectedUser && (
                    <UserInfoModal
                        ipAddress={userIpAddress}
                        user={selectedUser}
                        logInfo={selectedLogInfo}
                        onClose={() => setIsUserModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </Layout>
    );
}

export default UserActivityLog;
