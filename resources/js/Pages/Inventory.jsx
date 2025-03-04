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

    const [stats, setStats] = useState({
        totalItems: 0,
        leasedItems: 0,
        missingItems: 0
    });

    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, [search]);

    const fetchItems = async () => {
        const response = await axios.get('/api/inventory', { params: { search } });
        setItems(response.data);

        const total = response.data.length;
        const leased = response.data.filter(item => item.users && item.users.length > 0).length;
        const missing = response.data.filter(item => item.quantity === 0).length;

        setStats({
            totalItems: total,
            leasedItems: leased,
            missingItems: missing
        });
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
        return item.users && Array.isArray(item.users) && item.users.some(user => user.id === auth.user.id);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Head title="Inventory" />

            <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col md:block hidden">
                <h1 className="text-2xl font-bold mb-6">Inventory</h1>
                <nav>
                    <ul>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a></li>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Storage</a></li>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Leased Items</a></li>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Reports</a></li>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Admin Terminal</a></li>
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold">Total Items</h2>
                        <p className="text-2xl font-bold">{stats.totalItems}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold">Leased Items</h2>
                        <p className="text-2xl font-bold text-yellow-500">{stats.leasedItems}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold">Missing Items</h2>
                        <p className="text-2xl font-bold text-red-500">{stats.missingItems}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="w-full md:w-2/3 mb-4 md:mb-0">
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="p-3 border rounded-lg shadow-sm w-full"
                            />
                        </div>
                        <div className="flex">
                            <button
                                onClick={() => openModal()}
                                className="p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 mr-2"
                            >
                                Add Item
                            </button>
                            <a
                                href={`/user/${auth.user.id}/leased-items`}
                                className="p-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
                            >
                                View Leased Items
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Inventory Items</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Description</th>
                                <th className="py-3 px-4 text-left">Quantity</th>
                                <th className="py-3 px-4 text-left">Category</th>
                                <th className="py-3 px-4 text-left">Est. Price</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition duration-300">
                                    <td className="py-3 px-4">{item.name}</td>
                                    <td className="py-3 px-4">{item.description}</td>
                                    <td className="py-3 px-4">{item.quantity}</td>
                                    <td className="py-3 px-4">{item.category}</td>
                                    <td className="py-3 px-4">{item.estimated_price}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => openModal(item)}
                                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition mr-2"
                                        >
                                            Delete
                                        </button>
                                        {!isItemLeasedByCurrentUser(item) && (
                                            <button
                                                onClick={() => openLeaseModal(item)}
                                                className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                                            >
                                                Lease
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
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
                                <button type="submit" className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">{isEditing ? 'Update' : 'Add'}</button>
                                <button onClick={closeModal} className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition ml-2">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isLeaseModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
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
                                <button type="submit" className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">Lease</button>
                                <button onClick={closeModal} className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition ml-2">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;
