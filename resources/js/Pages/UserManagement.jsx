import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SidebarLayout from "@/Components/Sidebar/SidebarLayout.jsx";
import { Search, Plus, RefreshCw } from 'lucide-react';
import Toast from '@/Components/Common/Toast';
import UserCard from '@/Components/User/UserCard';
import UserFormModal from '@/Components/User/UserFormModal';
import DeleteConfirmationModal from '@/Components/User/DeleteConfirmationModal';
import Pagination from "@/Components/Pagination/Pagination.jsx";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [toast, setToast] = useState(null);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        perPage: 8
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, users]);

    const fetchUsers = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/users?page=${page}&perPage=${pagination.perPage}`);
            setUsers(response.data.data);
            setFilteredUsers(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                totalItems: response.data.total,
                totalPages: response.data.last_page,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Failed to load users', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (term) => {
        if (!term.trim()) {
            setFilteredUsers(users);
            return;
        }

        const lowercasedTerm = term.toLowerCase();
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(lowercasedTerm) ||
            user.email.toLowerCase().includes(lowercasedTerm) ||
            (user.department && user.department.toLowerCase().includes(lowercasedTerm)) ||
            (user.role && user.role.toLowerCase().includes(lowercasedTerm))
        );
        setFilteredUsers(filtered);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddUser = async (userData) => {
        try {
            const response = await axios.post('/users', userData);
            setUsers([...users, response.data]);
            setIsFormModalOpen(false);
            showToast('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
            showToast(error.response?.data?.message || 'Failed to add user', 'error');
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            const response = await axios.put(`/users/${currentUser.id}`, userData);
            setUsers(users.map(user => user.id === currentUser.id ? response.data : user));
            setIsFormModalOpen(false);
            showToast('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            showToast(error.response?.data?.message || 'Failed to update user', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            setIsDeleteModalOpen(false);
            showToast('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast(error.response?.data?.message || 'Failed to delete user', 'error');
        }
    };

    const handleBlockUser = async (user) => {
        try {
            await axios.post(`/users/${user.id}/block`);
            fetchUsers();
            showToast('User blocked successfully', 'success');
        } catch (error) {
            console.error('Error blocking user:', error);
            showToast('Failed to block user', 'error');
        }
    };

    const handleUnblockUser = async (user) => {
        try {
            await axios.post(`/users/${user.id}/unblock`);
            fetchUsers();
            showToast('User unblocked successfully', 'success');
        } catch (error) {
            console.error('Error unblocking user:', error);
            showToast('Failed to unblock user', 'error');
        }
    };

    const handlePageChange = (pageNumber) => {
        fetchUsers(pageNumber);
    };

    const openAddModal = () => {
        setCurrentUser(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        setIsFormModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
    };

    return (
        <SidebarLayout>
            <Head title="User Management" />

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h1 className="text-2xl font-bold text-blue-800 mb-6">User Management</h1>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-800 focus:border-blue-800"
                            />
                        </div>

                        <div className="flex space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={fetchUsers}
                                className="px-4 py-2 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 transition flex items-center"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Refresh
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={openAddModal}
                                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition flex items-center"
                            >
                                <Plus size={18} className="mr-2" />
                                Add User
                            </motion.button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 text-gray-400 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">
                                {searchTerm ? "No users matching your search" : "No users found"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredUsers.map(user => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onEdit={openEditModal}
                                    onDelete={openDeleteModal}
                                    onToggleBlock={handleBlockUser}
                                    onToggleUnblock={handleUnblockUser}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.perPage}
                />
            </div>

            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                user={currentUser}
                onSubmit={currentUser ? handleUpdateUser : handleAddUser}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                user={currentUser}
                onConfirm={handleDeleteUser}
            />
        </SidebarLayout>
    );
}

export default UserManagement;
