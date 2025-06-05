import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Package,
    Clipboard,
    User,
    LogOut,
    Menu,
    X,
    Users,
    FileText,
    ChevronsRight,
    ChevronsLeft,
    ActivityIcon,
    HistoryIcon
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', icon: Home, route: 'inventory-dashboard' },
    { name: 'Inventory', icon: Package, route: 'inventory' },
    { name: 'User Inventory', icon: Package, route: 'user-inventory' },
    { name: 'Lease Requests', icon: Clipboard, route: 'lease-request-management' },
    { name: 'All Leases', icon: FileText, href: 'admin-leases' },
    { name: 'Profile', icon: User, route: 'profile.edit' },
    { name: 'Users', icon: Users, href: 'user-management' },
    { name: 'Activity Log', icon: ActivityIcon, href: 'activity-log' },
    { name: 'Inventory Check History', icon: HistoryIcon, route: 'check-history' },
];

const sidebarWidths = [0, 64, 280];

const Sidebar = ({ user }) => {
    const [sidebarState, setSidebarState] = useState(window.innerWidth < 768 ? 0 : 2);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { component, url } = usePage();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setSidebarState(mobile ? 0 : 2);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMobileToggle = () => setSidebarState((prev) => (prev + 1) % 3);
    const handleDesktopToggle = () => setSidebarState(sidebarState === 2 ? 1 : 2);

    const HamburgerIcon = () => {
        if (sidebarState === 0) return <Menu size={24} />;
        if (sidebarState === 1) return <ChevronsRight size={24} />;
        return <ChevronsLeft size={24} />;
    };

    const isActive = (item) => {
        if (item.route) {
            return route().current(item.route);
        }
        if (item.href) {
            return url.startsWith(`/${item.href}`);
        }
        return false;
    };

    const showOverlay = isMobile && sidebarState > 0;

    return (
        <>
            {isMobile && (
                <div className="fixed top-4 left-4 z-50">
                    <button
                        onClick={handleMobileToggle}
                        className="p-2 rounded-full bg-blue-800 text-white shadow-lg"
                        aria-label="Toggle sidebar"
                    >
                        <HamburgerIcon />
                    </button>
                </div>
            )}

            <AnimatePresence>
                {sidebarState > 0 && (
                    <motion.div
                        key="sidebar"
                        id="sidebar"
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className={`fixed inset-y-0 left-0 z-40 md:relative`}
                        style={{ width: sidebarWidths[sidebarState] }}
                    >
                        <motion.div
                            initial={false}
                            animate={{ width: sidebarWidths[sidebarState] }}
                            className={`h-full bg-blue-900 shadow-xl flex flex-col text-white transition-all duration-300 relative`}
                        >
                            <div className="p-4 border-b border-blue-700 flex items-center justify-between relative">
                                {sidebarState === 2 && (
                                    <motion.h1
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="font-bold text-xl whitespace-nowrap overflow-hidden"
                                    >
                                        Inventory Manager
                                    </motion.h1>
                                )}
                                {!isMobile && (
                                    <button
                                        onClick={handleDesktopToggle}
                                        className="rounded p-1 hover:bg-blue-700 ml-2"
                                        aria-label={sidebarState === 2 ? "Collapse sidebar" : "Expand sidebar"}
                                    >
                                        {sidebarState === 2 ? <ChevronsLeft size={22} /> : <ChevronsRight size={22} />}
                                    </button>
                                )}
                            </div>
                            <nav className="flex-1 overflow-y-auto py-4">
                                <ul className="space-y-2 px-2">
                                    {navItems.map((item) => {
                                        const active = isActive(item);
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.route ? route(item.route) : item.href}
                                                    className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                                                        sidebarState === 1 ? 'justify-center' : ''
                                                    } ${
                                                        active
                                                            ? 'bg-blue-950 text-orange-300 font-bold shadow'
                                                            : 'hover:bg-blue-700'
                                                    }`}
                                                >
                                                    <item.icon size={20} className="text-orange-400" />
                                                    {sidebarState === 2 && (
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
                                        );
                                    })}
                                </ul>
                                {isMobile && (
                                    <div className={`mt-6 px-2`}>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center bg-blue-800"
                                        >
                                            <LogOut size={22} className="text-orange-400" />
                                            {sidebarState === 2 && (
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
                                )}
                            </nav>
                            {!isMobile && (
                                <div className={`absolute bottom-0 left-0 w-full p-4 border-t border-blue-700 bg-blue-900 ${sidebarState === 1 ? 'flex justify-center' : ''}`}>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                                    >
                                        <LogOut size={22} className="text-orange-400" />
                                        {sidebarState === 2 && (
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
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {showOverlay && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity duration-200"
                    onClick={() => setSidebarState(0)}
                />
            )}
        </>
    );
};

export default Sidebar;
