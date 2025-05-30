import React, {useState, useRef} from 'react';
import {Menu, LogOut, Archive, Package} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link, usePage} from '@inertiajs/react';

const MenuDropdown = ({userId, isLeasesPage}) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    React.useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    return (
        <div className="relative" ref={menuRef}>
            <motion.button
                whileHover={{scale: 1.08}}
                whileTap={{scale: 0.95}}
                onClick={() => setOpen((v) => !v)}
                onMouseEnter={() => setOpen(true)}
                className="px-3 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-900 transition flex items-center"
                aria-label="Open menu"
                type="button"
            >
                <Menu size={22}/>
            </motion.button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        onMouseLeave={() => setOpen(false)}
                        className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-50 py-2"
                    >
                        {isLeasesPage ? (
                            <a
                                href={`/user-inventory`}
                                className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-100 transition"
                            >
                                <Package size={18} className="mr-2 text-blue-800"/>
                                Back to Inventory
                            </a>
                        ) : (
                            <a
                                href={`/user/${userId}/leased-items`}
                                className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-100 transition"
                            >
                                <Archive size={18} className="mr-2 text-blue-800"/>
                                My Leases
                            </a>
                        )}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-blue-100 transition"
                        >
                            <LogOut size={18} className="mr-2 text-orange-500"/>
                            Logout
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Header = () => {
    const {auth} = usePage().props;
    return (
        <motion.header
            className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-6 flex justify-between items-center shadow-lg rounded-b-3xl"
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
        >
            <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-extrabold tracking-widest">Inventory Manager</h1>
            </div>
            {auth.user && <MenuDropdown userId={auth.user.id} isLeasesPage={false}/>}
        </motion.header>
    );
};

export const HeaderLeasedItems = () => {
    const {auth} = usePage().props;
    return (
        <motion.header
            className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-6 flex justify-between items-center shadow-lg rounded-b-3xl"
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
        >
            <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-extrabold tracking-widest">Inventory Manager</h1>
            </div>
            {auth.user && <MenuDropdown userId={auth.user.id} isLeasesPage={true}/>}
        </motion.header>
    );
};

export const Layout = ({children}) => (
    <div className="flex flex-col min-h-screen">
        <Header/>
        <main className="flex-grow p-6">{children}</main>
    </div>
);

export const LayoutLeasedItems = ({children}) => (
    <div className="flex flex-col min-h-screen">
        <HeaderLeasedItems/>
        <main className="flex-grow p-6">{children}</main>
    </div>
);

export default {Header, Layout};
