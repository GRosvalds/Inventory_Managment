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
                "search items [query] - Search inventory items",
                "search users [query] - Search users",
                "add user [name] [email] [password] - Add new user",
                "add item [name] [quantity] [price] [category] - Add new inventory item",
                "delete item [id] - Delete inventory item",
                "lease [item_id] [user_id] [duration] - Lease an item to user"
            ];

            commands.forEach(cmd => addOutput(cmd));
        },

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

        list: (args, addOutput) => {
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
            }
            else {
                addOutput(`Cannot delete '${target}'. Try 'item'`);
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

        refresh: async (args, addOutput) => {
            addOutput("Refreshing data...");
            await fetchItems();
            await fetchUsers();
            addOutput("Data refreshed successfully");
        }
    };
}
