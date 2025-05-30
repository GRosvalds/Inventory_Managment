import React from 'react';
import Sidebar from './Sidebar.jsx';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export const SidebarLayout = ({ children }) => {
    const { auth } = usePage().props;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar user={auth.user} />

            <main className="flex-1 p-6 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};

export default SidebarLayout;
