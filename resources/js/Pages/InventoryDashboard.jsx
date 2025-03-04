import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

const InventoryDashboard = () => {
    const [command, setCommand] = useState("");
    const [output, setOutput] = useState(["Welcome to Inventory Management System v1.0", "Type 'help' for a list of commands"]);
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalItems: 0,
        leasedItems: 0,
        missingItems: 0
    });

    const outputContainerRef = useRef(null);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        fetchItems();
        fetchUsers();
        if (outputContainerRef.current) {
            outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
        }
    }, [output]);

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
            addOutput(`Error fetching inventory: ${error.message}`);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            addOutput(`Error fetching users: ${error.message}`);
        }
    };

    const addOutput = (text) => {
        setOutput(prev => [...prev, text]);
    };

    const handleCommand = async (e) => {
        e.preventDefault();
        if (!command.trim()) return;

        addOutput(`> ${command}`);

        setCommandHistory(prev => [...prev, command]);
        setHistoryIndex(-1);

        const args = command.split(' ');
        const cmd = args[0].toLowerCase();

        try {
            switch (cmd) {
                case "help":
                    showHelp();
                    break;

                case "clear":
                    setOutput([]);
                    break;

                case "list":
                    handleListCommand(args);
                    break;

                case "add":
                    await handleAddCommand(args);
                    break;

                case "delete":
                    await handleDeleteCommand(args);
                    break;

                case "search":
                    handleSearchCommand(args);
                    break;

                case "lease":
                    await handleLeaseCommand(args);
                    break;

                case "status":
                    showStatus();
                    break;

                case "refresh":
                    addOutput("Refreshing data...");
                    await fetchItems();
                    await fetchUsers();
                    addOutput("Data refreshed successfully");
                    break;

                default:
                    addOutput(`Command not recognized: ${command}`);
                    addOutput("Type 'help' for a list of available commands");
            }
        } catch (error) {
            addOutput(`Error: ${error.message}`);
        }

        setCommand("");
    };

    const showHelp = () => {
        const commands = [
            "Available commands:",
            "help - Show this help message",
            "clear - Clear the terminal",
            "status - Show system status",
            "refresh - Refresh data from server",
            "list items - List all inventory items",
            "list users - List all users",
            "search items [query] - Search inventory items",
            "search users [query] - Search users",
            "add user [name] [email] [password] - Add new user",
            "add item [name] [quantity] [price] [category] - Add new inventory item",
            "delete item [id] - Delete inventory item",
            "lease [item_id] [user_id] [duration] - Lease an item to user"
        ];

        commands.forEach(cmd => addOutput(cmd));
    };

    const showStatus = () => {
        addOutput("System Status");
        addOutput("-------------");
        addOutput(`Total Items: ${stats.totalItems}`);
        addOutput(`Leased Items: ${stats.leasedItems}`);
        addOutput(`Missing Items: ${stats.missingItems}`);
        addOutput(`Users: ${users.length}`);
        addOutput(`Server Time: ${new Date().toLocaleString()}`);
        addOutput("-------------");
    };

    const handleListCommand = (args) => {
        if (args.length < 2) {
            addOutput("Error: Specify what to list (items or users)");
            return;
        }

        const target = args[1].toLowerCase();

        if (target === "items") {
            if (items.length === 0) {
                addOutput("No items found in inventory");
                return;
            }

            addOutput("ID | NAME | QTY | CATEGORY | PRICE");
            addOutput("-----------------------------------");
            items.slice(0, 10).forEach(item => {
                addOutput(`${item.id} | ${item.name} | ${item.quantity} | ${item.category} | $${item.estimated_price}`);
            });

            if (items.length > 10) {
                addOutput(`... ${items.length - 10} more items (use 'search items' to find specific items)`);
            }
        }
        else if (target === "users") {
            if (users.length === 0) {
                addOutput("No users found");
                return;
            }

            addOutput("ID | NAME | EMAIL");
            addOutput("----------------");
            users.forEach(user => {
                addOutput(`${user.id} | ${user.name} | ${user.email}`);
            });
        }
        else {
            addOutput(`Cannot list '${target}'. Try 'items' or 'users'`);
        }
    };

    const handleSearchCommand = (args) => {
        if (args.length < 3) {
            addOutput("Error: Specify what to search and a query (e.g., search items laptop)");
            return;
        }

        const target = args[1].toLowerCase();
        const query = args.slice(2).join(" ").toLowerCase();

        if (target === "items") {
            const results = items.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                addOutput(`No items found matching '${query}'`);
                return;
            }

            addOutput(`Found ${results.length} item(s) matching '${query}':`);
            addOutput("ID | NAME | QTY | CATEGORY | PRICE");
            addOutput("-----------------------------------");
            results.forEach(item => {
                addOutput(`${item.id} | ${item.name} | ${item.quantity} | ${item.category} | $${item.estimated_price}`);
            });
        }
        else if (target === "users") {
            const results = users.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                addOutput(`No users found matching '${query}'`);
                return;
            }

            addOutput(`Found ${results.length} user(s) matching '${query}':`);
            addOutput("ID | NAME | EMAIL");
            addOutput("----------------");
            results.forEach(user => {
                addOutput(`${user.id} | ${user.name} | ${user.email}`);
            });
        }
        else {
            addOutput(`Cannot search '${target}'. Try 'items' or 'users'`);
        }
    };

    const handleAddCommand = async (args) => {
        if (args.length < 2) {
            addOutput("Error: Specify what to add (user or item)");
            return;
        }

        const target = args[1].toLowerCase();

        if (target === "user") {
            if (args.length < 5) {
                addOutput("Error: add user requires name, email, and password");
                return;
            }

            const name = args[2];
            const email = args[3];
            const password = args[4];

            try {
                const response = await axios.post('/api/users', {
                    name,
                    email,
                    password,
                });

                addOutput(`User ${name} (${email}) created successfully with ID: ${response.data.id}`);
                await fetchUsers();
            } catch (error) {
                addOutput(`Failed to create user: ${error.response?.data?.message || error.message}`);
            }
        }
        else if (target === "item") {
            if (args.length < 6) {
                addOutput("Error: add item requires name, quantity, price, and category");
                return;
            }

            const name = args[2];
            const quantity = parseInt(args[3]);
            const price = parseFloat(args[4]);
            const category = args[5];

            try {
                const response = await axios.post('/api/inventory', {
                    name,
                    quantity,
                    estimated_price: price,
                    category,
                    description: `Added via terminal on ${new Date().toLocaleDateString()}`
                });

                addOutput(`Item '${name}' added successfully with ID: ${response.data.id}`);
                await fetchItems();
            } catch (error) {
                addOutput(`Failed to add item: ${error.response?.data?.message || error.message}`);
            }
        }
        else {
            addOutput(`Cannot add '${target}'. Try 'user' or 'item'`);
        }
    };

    const handleDeleteCommand = async (args) => {
        if (args.length < 3) {
            addOutput("Error: Specify what to delete and ID (e.g., delete item 5)");
            return;
        }

        const target = args[1].toLowerCase();
        const id = parseInt(args[2]);

        if (isNaN(id)) {
            addOutput("Error: ID must be a number");
            return;
        }

        if (target === "item") {
            try {
                await axios.delete(`/api/inventory/${id}`);
                addOutput(`Item with ID ${id} deleted successfully`);
                await fetchItems();
            } catch (error) {
                addOutput(`Failed to delete item: ${error.response?.data?.message || error.message}`);
            }
        }
        else {
            addOutput(`Cannot delete '${target}'. Try 'item'`);
        }
    };

    const handleLeaseCommand = async (args) => {
        if (args.length < 4) {
            addOutput("Error: lease requires item_id, user_id, and duration");
            addOutput("Usage: lease [item_id] [user_id] [duration in days]");
            return;
        }

        const itemId = parseInt(args[1]);
        const userId = parseInt(args[2]);
        const duration = parseInt(args[3]);

        if (isNaN(itemId) || isNaN(userId) || isNaN(duration)) {
            addOutput("Error: All parameters must be numbers");
            return;
        }

        try {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + duration);
            const formattedDate = endDate.toISOString().split('T')[0];

            await axios.post(`/api/inventory/${itemId}/lease`, {
                userId: userId,
                leaseDuration: formattedDate
            });

            addOutput(`Item ${itemId} leased to user ${userId} for ${duration} days`);
            await fetchItems();
        } catch (error) {
            addOutput(`Failed to lease item: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCommand('');
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col md:block hidden">
                <h1 className="text-2xl font-bold mb-6">Inventory</h1>
                <nav>
                    <ul>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a></li>
                        <li className="mb-4"><a href="#" className="block p-2 hover:bg-gray-700 rounded">Storage</a></li>
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

                <div className="mt-6 bg-black text-green-400 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-white mb-2">Admin Terminal</h2>
                    <div ref={outputContainerRef}
                         className="h-80 overflow-y-auto bg-gray-900 p-4 rounded-md font-mono text-sm"
                    >
                        {output.map((line, index) => (
                            <div key={index} className={line.startsWith('>') ? "text-blue-300 font-bold" : "text-green-300"}>
                                {line}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleCommand} className="mt-2 flex">
                        <input
                            type="text"
                            className="w-full bg-gray-800 text-green-300 p-2 rounded-md font-mono"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter command... (type 'help' for commands)"
                            autoFocus
                        />
                        <button type="submit" className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                            Execute
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default InventoryDashboard;
