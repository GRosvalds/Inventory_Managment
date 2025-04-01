import React, { useState, useEffect } from "react";
import axios from 'axios';
import useTerminal from '../Hooks/useTerminal';
import createCommandHandlers from '../Services/TerminalCommands';
import Terminal from '../Components/Terminal/Terminal';

const InventoryDashboard = () => {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalItems: 0,
        leasedItems: 0,
        missingItems: 0
    });

    const fetchItems = async () => {
        try {
            const response = await axios.get('/api/inventory');
            setItems(response.data);

            const total = response.data.length;
            const leased = response.data.filter(item => item.users && item.users.length > 0).length;
            const missing = response.data.filter(item => item.quantity === 0).length;

            setStats({
                totalItems: total,
                leasedItems: leased,
                missingItems: missing
            });
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, []);

    const commandHandlers = createCommandHandlers(
        items,
        users,
        stats,
        fetchItems,
        fetchUsers
    );

    const terminal = useTerminal(commandHandlers);

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col md:block hidden">
                <h1 className="text-2xl font-bold mb-6">Inventory</h1>
                <nav>
                    <ul>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a></li>
                        <li className="mb-4"><a href="/inventory" className="block p-2 hover:bg-gray-700 rounded">Storage</a></li>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Leased Items</a></li>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Reports</a></li>
                        <li className="mb-4"><a href="#" className="block p-2 bg-gray-700 rounded">Admin Terminal</a></li>
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="mt-6">
                    <Terminal {...terminal} />
                </div>
            </main>
        </div>
    );
};

export default InventoryDashboard;
