import axios from 'axios';

export default function createCommandHandlers(items, users, stats, fetchItems, fetchUsers) {
    return {
        help: (args, addOutput) => {
            const commands = [
                "Available commands:",
                "help - Show this help message",
                "clear - Clear the terminal",
                "status - Show system status",
                "refresh - Refresh data from server",
                "list items - List all inventory items",
                "list users - List all users",
                "list leases - List all active leases",
                "search items [query] - Search inventory items",
                "search users [query] - Search users",
                "add user [name] [email] [phone] [password] [roleId] - Add new user",
                "add item [name] [quantity] [price] [category] - Add new inventory item",
                "delete item [id] - Delete inventory item",
                "delete user [id] - Delete user",
                "update item [id] [field] [value] - Update item field",
                "update user [id] [field] [value] - Update user field",
                "show item [id] - Show item details",
                "show user [id] - Show user details",
                "lease [item_id] [user_id] [duration] - Lease an item to user",
                "return lease [lease_id] - Return a leased item",
                "show lease [id] - Show lease details",
                "activity logs - Show activity logs",
                "roles - List all roles",
                "permissions - List all permissions",
                "block user [id] - Block a user",
                "unblock user [id] - Unblock a user",
                "check - Show inventory check history"
            ];
            commands.forEach(cmd => addOutput(cmd));
        },

        clear: (args, addOutput, setOutput) => setOutput([]),

        status: (args, addOutput) => {
            addOutput("System Status");
            addOutput("-------------");
            addOutput(`Total Items: ${stats.totalItems}`);
            addOutput(`Leased Items: ${stats.leasedItems}`);
            addOutput(`Missing Items: ${stats.missingItems}`);
            addOutput(`Users: ${users.length}`);
            addOutput(`Server Time: ${new Date().toLocaleString()}`);
            addOutput("-------------");
        },

        list: async (args, addOutput) => {
            if (args.length < 2) {
                addOutput("Error: Specify what to list (items, users, leases)");
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
            } else if (target === "users") {
                if (users.length === 0) {
                    addOutput("No users found");
                    return;
                }
                addOutput("ID | NAME | EMAIL");
                addOutput("----------------");
                users.forEach(user => {
                    addOutput(`${user.id} | ${user.name} | ${user.email}`);
                });
            } else if (target === "leases") {
                try {
                    const response = await axios.get('/leases');
                    const leases = response.data.data;
                    console.log(leases);
                    if (!leases.length) {
                        addOutput("No leases found");
                        return;
                    }
                    addOutput("ID | ITEM | USER | LEASE UNTIL");
                    addOutput("-----------------------------------");
                    leases.forEach(lease => {
                        addOutput(`${lease.id} | ${lease.item.name} | ${lease.user.name} | ${new Date(lease.lease_until).toLocaleDateString()}`);                    });
                } catch (error) {
                    addOutput(`Failed to fetch leases: ${error.response?.data?.message || error.message}`);
                }
            } else {
                addOutput(`Cannot list '${target}'. Try 'items', 'users', or 'leases'`);
            }
        },

        search: (args, addOutput) => {
            if (args.length < 3) {
                addOutput("Error: Specify what to search and a query (e.g., search items laptop)");
                return;
            }
            const target = args[1].toLowerCase();
            const query = args.slice(2).join(" ").toLowerCase();
            if (target === "items") {
                const results = items.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query) ||
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
            } else if (target === "users") {
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
            } else {
                addOutput(`Cannot search '${target}'. Try 'items' or 'users'`);
            }
        },

        add: async (args, addOutput) => {
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
                const [name, email, phone, password, role_id] = args.slice(2);
                try {
                    const response = await axios.post('/users', { name, email, phone, password, role_id,  });
                    addOutput(`User ${name} (${email}) created successfully with ID: ${response.data.id}`);
                    await fetchUsers();
                } catch (error) {
                    addOutput(`Failed to create user: ${error.response?.data?.message || error.message}`);
                }
            } else if (target === "item") {
                if (args.length < 6) {
                    addOutput("Error: add item requires name, quantity, price, and category");
                    return;
                }
                const [name, quantity, price, category] = args.slice(2, 6);
                try {
                    const response = await axios.post('/api/inventory', {
                        name,
                        initial_quantity: parseInt(quantity),
                        quantity: parseInt(quantity),
                        estimated_price: parseFloat(price),
                        category,
                        description: `Added via terminal on ${new Date().toLocaleDateString()}`
                    });
                    addOutput(`Item '${name}' added successfully with ID: ${response.data.id}`);
                    await fetchItems();
                } catch (error) {
                    addOutput(`Failed to add item: ${error.response?.data?.message || error.message}`);
                }
            } else {
                addOutput(`Cannot add '${target}'. Try 'user' or 'item'`);
            }
        },

        delete: async (args, addOutput) => {
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
            } else if (target === "user") {
                try {
                    await axios.delete(`/users/${id}`);
                    addOutput(`User with ID ${id} deleted successfully`);
                    await fetchUsers();
                } catch (error) {
                    addOutput(`Failed to delete user: ${error.response?.data?.message || error.message}`);
                }
            } else {
                addOutput(`Cannot delete '${target}'. Try 'item' or 'user'`);
            }
        },

        update: async (args, addOutput) => {
            if (args.length < 5) {
                addOutput("Error: update [item|user] [id] [field] [value]");
                return;
            }
            const target = args[1].toLowerCase();
            const id = parseInt(args[2]);
            const field = args[3];
            const value = args[4];
            if (isNaN(id)) {
                addOutput("Error: ID must be a number");
                return;
            }
            if (target === "item") {
                try {
                    await axios.put(`/api/inventory/${id}`, { [field]: value });
                    addOutput(`Item ${id} updated: ${field} = ${value}`);
                    await fetchItems();
                } catch (error) {
                    addOutput(`Failed to update item: ${error.response?.data?.message || error.message}`);
                }
            } else if (target === "user") {
                try {
                    const { data: currentUser } = await axios.get(`/users/${id}`);
                    const updatedUser = { ...currentUser, [field]: value };
                    await axios.put(`/users/${id}`, updatedUser);
                    addOutput(`User ${id} updated: ${field} = ${value}`);
                    await fetchUsers();
                } catch (error) {
                    addOutput(`Failed to update user: ${error.response?.data?.message || error.message}`);
                }
            } else {
                addOutput(`Cannot update '${target}'. Try 'item' or 'user'`);
            }
        },

        show: async (args, addOutput) => {
            if (args.length < 3) {
                addOutput("Error: show [item|user|lease] [id]");
                return;
            }
            const target = args[1].toLowerCase();
            const id = parseInt(args[2]);
            if (isNaN(id)) {
                addOutput("Error: ID must be a number");
                return;
            }
            try {
                if (target === "item") {
                    const { data } = await axios.get(`/api/inventory`);
                    const itemsArray = Array.isArray(data.data) ? data.data : [];
                    const item = itemsArray.find(i => i.id === id);
                    if (!item) {
                        addOutput(`Item ${id} not found`);
                        return;
                    }
                    addOutput(JSON.stringify(item, null, 2));
                } else if (target === "user") {
                    const { data } = await axios.get(`/users/${id}`);
                    addOutput(JSON.stringify(data, null, 2));
                } else if (target === "lease") {
                    const { data } = await axios.get(`/leases/${id}`);
                    addOutput(JSON.stringify(data, null, 2));
                } else {
                    addOutput(`Cannot show '${target}'. Try 'item', 'user', or 'lease'`);
                }
            } catch (error) {
                addOutput(`Failed to show ${target}: ${error.response?.data?.message || error.message}`);
            }
        },

        lease: async (args, addOutput) => {
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
        },

        "return": async (args, addOutput) => {
            if (args.length < 3 || args[1] !== "lease") {
                addOutput("Usage: return lease [lease_id]");
                return;
            }
            const leaseId = parseInt(args[2]);
            if (isNaN(leaseId)) {
                addOutput("Error: lease_id must be a number");
                return;
            }
            try {
                await axios.delete(`/leases/${leaseId}`);
                addOutput(`Lease ${leaseId} returned successfully`);
                await fetchItems();
            } catch (error) {
                addOutput(`Failed to return lease: ${error.response?.data?.message || error.message}`);
            }
        },

        roles: async (args, addOutput) => {
            try {
                const { data } = await axios.get('/roles');
                if (Array.isArray(data)) {
                    addOutput("Roles:");
                    data.forEach(role => addOutput(`- ${role.name}`));
                } else {
                    addOutput("No roles found.");
                }
            } catch (error) {
                addOutput(`Failed to fetch roles: ${error.response?.data?.message || error.message}`);
            }
        },

        permissions: async (args, addOutput) => {
            try {
                const { data } = await axios.get('/permissions');
                if (Array.isArray(data)) {
                    addOutput("Permissions:");
                    data.forEach(permission => addOutput(`- ${permission.name}`));
                } else {
                    addOutput("No permissions found.");
                }
            } catch (error) {
                addOutput(`Failed to fetch permissions: ${error.response?.data?.message || error.message}`);
            }
        },

        activity: async (args, addOutput) => {
            try {
                const { data } = await axios.get('/activity-logs');
                if (Array.isArray(data.data) && data.data.length > 0) {
                    addOutput("ID | USER | ACTION | DESCRIPTION | DATE | IP ADDRESS");
                    addOutput("--------------------------------------------------------------------------");
                    data.data.forEach(log => {
                        addOutput(
                            `${log.id} | ${log.user?.name || 'N/A'} | ${log.action} | ${log.description} | ${new Date(log.created_at).toLocaleString()} | ${log.ip_address || 'N/A'}`
                        );
                    });
                } else {
                    addOutput("No activity logs found.");
                }
            } catch (error) {
                addOutput(`Failed to fetch activity logs: ${error.response?.data?.message || error.message}`);
            }
        },

        "block": async (args, addOutput) => {
            if (args.length < 3 || args[1] !== "user") {
                addOutput("Usage: block user [id]");
                return;
            }
            const id = parseInt(args[2]);
            if (isNaN(id)) {
                addOutput("Error: ID must be a number");
                return;
            }
            try {
                await axios.post(`/users/${id}/block`);
                addOutput(`User ${id} blocked`);
                await fetchUsers();
            } catch (error) {
                addOutput(`Failed to block user: ${error.response?.data?.message || error.message}`);
            }
        },

        "unblock": async (args, addOutput) => {
            if (args.length < 3 || args[1] !== "user") {
                addOutput("Usage: unblock user [id]");
                return;
            }
            const id = parseInt(args[2]);
            if (isNaN(id)) {
                addOutput("Error: ID must be a number");
                return;
            }
            try {
                await axios.post(`/users/${id}/unblock`);
                addOutput(`User ${id} unblocked`);
                await fetchUsers();
            } catch (error) {
                addOutput(`Failed to unblock user: ${error.response?.data?.message || error.message}`);
            }
        },

        refresh: async (args, addOutput) => {
            addOutput("Refreshing data...");
            await fetchItems();
            await fetchUsers();
            addOutput("Data refreshed successfully");
        },

        check: async (args, addOutput) => {
            if (args.length < 1 || args[0] !== "check") {
                addOutput("Usage: check");
                return;
            }
            try {
                const { data } = await axios.get('/inventory-check-history');
                if (Array.isArray(data.data) && data.data.length > 0) {
                    addOutput("ID | DESCRIPTION | ACTION | DATE");
                    addOutput("----------------------------------------");
                    data.data.forEach(log => {
                        addOutput(
                            `${log.id} | ${log.description} | ${log.action} | ${new Date(log.created_at).toLocaleString()}`
                        );
                    });
                } else {
                    addOutput("No inventory check history found.");
                }
            } catch (error) {
                addOutput(`Failed to fetch inventory check history: ${error.response?.data?.message || error.message}`);
            }
        },
    };
}
