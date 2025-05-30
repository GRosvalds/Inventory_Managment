import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarLayout from "@/Components/Sidebar/SidebarLayout.jsx";
import Toast from "@/Components/Toast";
import StatCards from "@/Components/Inventory/StatCards";
import SearchFilter from "@/Components/Inventory/SearchFilter";
import InventoryTable from "@/Components/Inventory/InventoryTable";
import ItemModal from "@/Components/Inventory/ItemModal";
import LeaseModal from "@/Components/Inventory/LeaseModal";
import Pagination from "@/Components/Pagination/Pagination.jsx";

function Inventory() {
    const { auth } = usePage().props;
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [newItem, setNewItem] = useState({ name: '', description: '', initial_quantity: 0, quantity: 0, category: '', estimated_price: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [leaseDetails, setLeaseDetails] = useState({ userId: '', leaseDuration: '', quantity: 1 });
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');

    const [stats, setStats] = useState({
        totalItems: 0,
        leasedItems: 0,
        missingItems: 0
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        perPage: 1
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, [search, categoryFilter, availabilityFilter]);

    const fetchItems = async (page = 1) => {
        setIsLoading(true);
        try {
            const inventoryResponse = await axios.get('api/inventory', {
                params: {
                    search,
                    category: categoryFilter,
                    availability: availabilityFilter,
                    page: page,
                    perPage: 12
                }
            });

            const leaseResponse = await axios.get('/leases');
            const allLeases = leaseResponse.data;
            const leaseCount = allLeases.data.length;

            const itemsData = inventoryResponse.data.data || inventoryResponse.data;
            const itemsWithLeases = Array.isArray(itemsData) ? itemsData.map(item => ({...item})) : [];

            setItems(itemsWithLeases);

            if (inventoryResponse.data.current_page) {
                setPagination({
                    currentPage: inventoryResponse.data.current_page,
                    totalItems: inventoryResponse.data.total,
                    totalPages: inventoryResponse.data.last_page,
                    perPage: inventoryResponse.data.per_page || 12
                });
            } else {
                setPagination({
                    currentPage: page,
                    totalItems: itemsWithLeases.length,
                    totalPages: 1,
                    perPage: 12
                });
            }

            const total = inventoryResponse.data.total || itemsWithLeases.length;
            const leased = leaseCount;
            const missing = itemsWithLeases.filter(item => item.quantity === 0).length;

            setStats({
                totalItems: total,
                leasedItems: leased,
                missingItems: missing
            });
        } catch (error) {
            console.error('Error fetching inventory:', error);
            showToast('Failed to load inventory items', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Tiek veikta lietotāju datu iegūšana
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Failed to load user data', 'error');
        }
    };

    const handlePageChange = (pageNumber) => {
        fetchItems(pageNumber);
    };

    const openModal = (item = null) => {
        if (item) {
            setNewItem(item);
            setIsEditing(true);
            setCurrentItemId(item.id);
        } else {
            setNewItem({ name: '', description: '', initial_quantity: 0, quantity: 0, category: '', estimated_price: 0 });
            setIsEditing(false);
            setCurrentItemId(null);
        }
        setIsModalOpen(true);
    };

    const openLeaseModal = (item) => {
        setCurrentItemId(item.id);
        setLeaseDetails({ userId: '', leaseDuration: '', quantity: 1 });
        setIsLeaseModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsLeaseModalOpen(false);
    };

    // Tiek veikta jaunā priekšmeta pievienošana vai esošā rediģēšana
    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await axios.put(`/api/inventory/${currentItemId}`, newItem);
                showToast('Item updated successfully');
            } else {
                await axios.post('/api/inventory', newItem);
                showToast('Item added successfully');
            }
            fetchItems();
            closeModal();
        } catch (error) {
            console.error('Error updating inventory:', error);
            showToast('Failed to update inventory', 'error');
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        const currentItem = items.find(item => item.id === currentItemId);
        const maxAvailable = currentItem ? currentItem.quantity : 1;
        const safeValue = Math.min(Math.max(1, value), maxAvailable);
        setLeaseDetails({ ...leaseDetails, quantity: safeValue });
    };

    const handleLeaseSubmit = async () => {
        try {
            const leaseData = {
                user_id: leaseDetails.userId,
                inventory_item_id: currentItemId,
                lease_until: leaseDetails.leaseDuration,
                quantity: leaseDetails.quantity,
            };

            await axios.post('/leases', leaseData);
            showToast('Item leased successfully');
            fetchItems();
            closeModal();
        } catch (error) {
            console.error('Error leasing item:', error);
            showToast('Failed to lease item', 'error');
        }
    };

    //Dzēst priekšmetu
    const deleteItem = async (id) => {
        try {
            await axios.delete(`/api/inventory/${id}`);
            showToast('Item deleted successfully');
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            showToast('Failed to delete item', 'error');
        }
    };

    const isItemLeasedByCurrentUser = (item) => {
        return item.users && Array.isArray(item.users) && item.users.some(user => user.id === auth.user.id);
    };

    const categories = ['Electronics', 'Furniture', 'Office Supplies', 'Tools', 'Other'];

    const statCards = [
        { title: 'Total Items', value: stats.totalItems, color: 'text-blue-800' },
        { title: 'Leased Items', value: stats.leasedItems, color: 'text-orange-500' },
        { title: 'Missing Items', value: stats.missingItems, color: 'text-red-500' }
    ];

    return (
        <SidebarLayout>
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
                    <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">Inventory Management</h1>
                    <div className="flex space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openModal()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition duration-300 flex items-center"
                        >
                            Add Item
                        </motion.button>
                    </div>
                </motion.div>

                <StatCards stats={stats} />
                <SearchFilter
                    search={search}
                    setSearch={setSearch}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    availabilityFilter={availabilityFilter}
                    setAvailabilityFilter={setAvailabilityFilter}
                />
                <InventoryTable
                    items={items}
                    openModal={openModal}
                    deleteItem={deleteItem}
                    openLeaseModal={openLeaseModal}
                    isItemLeasedByCurrentUser={isItemLeasedByCurrentUser}
                />

                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.perPage}
                />
            </div>


            <ItemModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                newItem={newItem}
                setNewItem={setNewItem}
                isEditing={isEditing}
                categories={categories}
            />

            <LeaseModal
                isOpen={isLeaseModalOpen}
                onClose={closeModal}
                onSubmit={handleLeaseSubmit}
                leaseDetails={leaseDetails}
                setLeaseDetails={setLeaseDetails}
                users={users}
                categories={categories}
                maxQuantity={items.find((item) => item.id === currentItemId)?.quantity || 1}
            />
        </SidebarLayout>
    );
}

export default Inventory;
