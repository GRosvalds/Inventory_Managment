import React from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
    return (
        <motion.header
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 flex justify-between items-center shadow-lg rounded-b-3xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-extrabold tracking-widest">Inventory Manager</h1>
            </div>
            <div className="flex items-center space-x-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="rounded-full p-3 text-gray-700 focus:outline-none shadow-lg transition-transform duration-300 hover:scale-105"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <User className="cursor-pointer hover:scale-125 transition-transform duration-300" />
            </div>
        </motion.header>
    );
};

export const Footer = () => {
    return (
        <motion.footer
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center shadow-lg rounded-t-3xl mt-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex items-center space-x-4">
                <p className="text-sm">&copy; 2025 Inventory Manager. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
                <a href="#" className="hover:text-gray-300 transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-gray-300 transition-colors duration-300">Terms of Service</a>
                <a href="#" className="hover:text-gray-300 transition-colors duration-300">Contact Us</a>
            </div>
        </motion.footer>
    );
};

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow p-6">{children}</main>
            <Footer />
        </div>
    );
};

export default { Header, Footer, Layout };
