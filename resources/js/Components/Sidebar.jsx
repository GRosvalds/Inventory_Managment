
import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Package,
    Clipboard,
    User,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';

const Sidebar = ({ user }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: Home, route: 'inventory-dashboard' },
        { name: 'Inventory', icon: Package, route: 'inventory' },
        { name: 'User Inventory', icon: Package, route: 'user-inventory' },
        { name: 'Lease Requests', icon: Clipboard, route: 'lease-request-management' },
        { name: 'Profile', icon: User, route: 'profile.edit' },
        { name: 'Settings', icon: Settings, href: '#' },
    ];

    const sidebarVariants = {
        expanded: { width: '280px' },
        collapsed: { width: '80px' }
    };

    const MobileToggle = () => (
        <div className="md:hidden fixed top-4 left-4 z-50">
            <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="p-2 rounded-full bg-blue-800 text-white shadow-lg"
            >
                {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>
    );

    return (
        <>
            <MobileToggle />

            <AnimatePresence>
                {(showMobileSidebar || !collapsed) && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed inset-y-0 left-0 md:relative z-40"
                    >
                        <motion.div
                            variants={sidebarVariants}
                            initial={collapsed ? "collapsed" : "expanded"}
                            animate={collapsed ? "collapsed" : "expanded"}
                            className={`h-full bg-blue-900 shadow-xl flex flex-col text-white ${
                                showMobileSidebar ? 'w-64' : ''
                            }`}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="p-4 border-b border-blue-700 flex items-center justify-between">
                                {!collapsed && (
                                    <motion.h1
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="font-bold text-xl whitespace-nowrap overflow-hidden"
                                    >
                                        Inventory Manager
                                    </motion.h1>
                                )}

                                <button
                                    onClick={() => setCollapsed(!collapsed)}
                                    className="rounded p-1 hover:bg-blue-700 hidden md:block"
                                >
                                    <ChevronRight className={`transform transition-transform ${collapsed ? '' : 'rotate-180'}`} />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto py-4">
                                <ul className="space-y-2 px-2">
                                    {navItems.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.route ? route(item.route) : item.href}
                                                className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-700 transition-colors ${
                                                    collapsed ? 'justify-center' : ''
                                                }`}
                                            >
                                                <item.icon size={20} className="text-orange-400" />
                                                {!collapsed && (
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="truncate"
                                                    >
                                                        {item.name}
                                                    </motion.span>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <div className={`p-4 border-t border-blue-700 ${collapsed ? 'flex justify-center' : ''}`}>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                                >
                                    <LogOut size={20} className="text-orange-400" />
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            Log Out
                                        </motion.span>
                                    )}
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
