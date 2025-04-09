import React from 'react';
import { Search, User, ShoppingCart, Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';

export const Header = () => {
    const { auth } = usePage().props;

    return (
        <motion.header
            className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-6 flex justify-between items-center shadow-lg rounded-b-3xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-extrabold tracking-widest">Inventory Manager</h1>
            </div>
            {auth.user && (
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/user/${auth.user.id}/leased-items`}
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-900 transition duration-300 flex items-center"
                >
                    <Archive size={18} className="mr-2" />
                    My Leases
                </motion.a>
            )}
        </motion.header>
    );
};

export const HeaderLeasedItems = () => {
    const { auth } = usePage().props;

    return (
        <motion.header
            className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-6 flex justify-between items-center shadow-lg rounded-b-3xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-extrabold tracking-widest">Inventory Manager</h1>
            </div>
            {auth.user && (
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/user-inventory`}
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-900 transition duration-300 flex items-center"
                >
                    <Archive size={18} className="mr-2" />
                    Back to Inventory
                </motion.a>
            )}
        </motion.header>
    );
};

export const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-6">{children}</main>
        </div>
    );
};

export const LayoutLeasedItems = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderLeasedItems />
            <main className="flex-grow p-6">{children}</main>
        </div>
    );
};

export default { Header, Layout };
