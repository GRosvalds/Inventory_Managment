import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';

function Inventory() {
    const { auth } = usePage().props;
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [newItem, setNewItem] = useState({ name: '', description: '', quantity: 0, category: '', estimated_price: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [leaseDetails, setLeaseDetails] = useState({ userId: '', leaseDuration: '' });

    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, [search]);

    const fetchItems = async () => {
        const response = await axios.get('/api/inventory', { params: { search } });
        setItems(response.data);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setNewItem(item);
            setIsEditing(true);
            setCurrentItemId(item.id);
        } else {
            setNewItem({ name: '', description: '', quantity: 0, category: '', estimated_price: 0 });
            setIsEditing(false);
            setCurrentItemId(null);
        }
        setIsModalOpen(true);
    };

    const openLeaseModal = (item) => {
        setCurrentItemId(item.id);
        setIsLeaseModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsLeaseModalOpen(false);
    };

    const handleSubmit = async () => {
        if (isEditing) {
            await axios.put(`/api/inventory/${currentItemId}`, newItem);
        } else {
            await axios.post('/api/inventory', newItem);
        }
        fetchItems();
        closeModal();
    };

    const handleLeaseSubmit = async () => {
        await axios.post(`/api/inventory/${currentItemId}/lease`, leaseDetails);
        fetchItems();
        closeModal();
    };

    const deleteItem = async (id) => {
        await axios.delete(`/api/inventory/${id}`);
        fetchItems();
    };

    const isItemLeasedByCurrentUser = (item) => {
        return item.users && item.users.some(user => user.id === auth.user.id);
    };

    return (
        <>
            <Head title="Inventory" />
            <div className="p-6 text-center bg-gray-100 min-h-screen flex justify-center">
                <div className="max-w-4xl w-full">
                    <h1 className="text-4xl font-bold text-orange-600 mb-6">Inventory Management</h1>
                    <div className="flex justify-center mb-6">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-3 border rounded-lg shadow-sm w-1/2"
                        />
                    </div>
                    <div className="flex justify-center mb-6">
                        <button onClick={() => openModal()} className="p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">Add Item</button>
                        <a href={`/user/${auth.user.id}/leased-items`} className="p-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ml-2">View Leased Items</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-lg rounded-lg">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Description</th>
                                <th className="py-3 px-4">Quantity</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Estimated Price</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-100 transition duration-300">
                                    <td className="py-3 px-4">{item.name}</td>
                                    <td className="py-3 px-4">{item.description}</td>
                                    <td className="py-3 px-4">{item.quantity}</td>
                                    <td className="py-3 px-4">{item.category}</td>
                                    <td className="py-3 px-4">{item.estimated_price}</td>
                                    <td className="py-3 px-4">
                                        <button onClick={() => openModal(item)} className="p-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ml-2">Edit</button>
                                        <button onClick={() => deleteItem(item.id)} className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ml-2">Delete</button>
                                        {!isItemLeasedByCurrentUser(item) && (
                                            <button onClick={() => openLeaseModal(item)} className="p-2 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 ml-2">Lease</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Item' : 'Add Item'}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="p-3 border rounded-lg shadow-sm w-full mb-4"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                className="p-3 border rounded-lg shadow-sm w-full mb-4"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                                className="p-3 border rounded-lg shadow-sm w-full mb-4"
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                className="p-3 border rounded-lg shadow-sm w-full mb-4"
                            />
                            <input
                                type="number"
                                placeholder="Estimated Price"
                                value={newItem.estimated_price}
                                onChange={(e) => setNewItem({ ...newItem, estimated_price: parseFloat(e.target.value) })}
                                className="p-3 border rounded-lg shadow-sm w-full mb-4"
                            />
                            <div className="flex justify-end">
                                <button type="submit" className="p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">{isEditing ? 'Update' : 'Add'}</button>
                                <button onClick={closeModal} className="p-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 ml-2">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isLeaseModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">Lease Item</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleLeaseSubmit(); }}>
                            <select
                                value={leaseDetails.userId}
                                onChange={(e) => setLeaseDetails({ ...leaseDetails, userId: e.target.value })}
                                className="p-3 border rounded-lg shadow-sm w-full mb-4"
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={leaseDetails.leaseDuration}
                                onChange={(e) => setLeaseDetails({ ...leaseDetails, leaseDuration: e.target.value })}
                                className="p-3 border rounded-lg shadow-sm w-full mb-4"
                            />
                            <div className="flex justify-end">
                                <button type="submit" className="p-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300">Lease</button>
                                <button onClick={closeModal} className="p-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 ml-2">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Inventory;
