import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import useTerminal from '../Hooks/useTerminal';
import createCommandHandlers from '../Services/TerminalCommands';
import Terminal from '../Components/Terminal/Terminal';
import { SidebarLayout } from '../Components/SidebarLayout';
import { motion } from 'framer-motion';
import { Server, Users, AlertCircle, Terminal as TerminalIcon } from 'lucide-react';

const InventoryDashboard = () => {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalItems: 0,
        leasedItems: 0,
        missingItems: 0
    });

    const dataRef = useRef({
        items: [],
        users: [],
        stats: {
            totalItems: 0,
            leasedItems: 0,
            missingItems: 0
        }
    });

    dataRef.current.items = items;
    dataRef.current.users = users;
    dataRef.current.stats = stats;

    const fetchItems = useCallback(async () => {
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, [fetchItems, fetchUsers]);

    const commandHandlers = useCallback(() => {
        return createCommandHandlers(
            dataRef.current.items,
            dataRef.current.users,
            dataRef.current.stats,
            fetchItems,
            fetchUsers
        );
    }, [fetchItems, fetchUsers]);

    const terminal = useTerminal(commandHandlers());

    const statCards = [
        { title: 'Total Items', value: stats.totalItems, color: 'text-blue-800', icon: <Server size={20} /> },
        { title: 'Leased Items', value: stats.leasedItems, color: 'text-orange-500', icon: <Users size={20} /> },
        { title: 'Missing Items', value: stats.missingItems, color: 'text-red-500', icon: <AlertCircle size={20} /> }
    ];

    return (
        <SidebarLayout>
            <div className="container mx-auto">
                <motion.div
                    className="flex flex-col md:flex-row md:justify-between items-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">Admin Terminal Dashboard</h1>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {statCards.map((card, index) => (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-800"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className={card.color}>{card.icon}</span>
                                        <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
                                    </div>
                                    <p className={`text-3xl font-bold ${card.color} mt-2`}>{card.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white p-6 rounded-lg shadow-md mb-8"
                        >
                            <div className="flex items-center space-x-2 mb-4">
                                <TerminalIcon size={20} className="text-blue-800" />
                                <h2 className="text-xl font-semibold text-blue-800">Admin Terminal</h2>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Use the terminal below to manage inventory and users with commands.
                                Type 'help' to see available commands.
                            </p>
                            <div className="mt-4">
                                <Terminal {...terminal} />
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </SidebarLayout>
    );
};

export default InventoryDashboard;
