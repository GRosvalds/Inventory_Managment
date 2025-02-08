import React from "react";
import { Link } from '@inertiajs/react';

function Home() {
    return (
        <div className="p-6 text-center">
            <h1 className="text-4xl font-bold text-orange-600">Welcome to the Home Page!</h1>
            <p className="text-gray-700">This is an Inertia-powered React page.</p>
            <Link href="/inventory" className="mt-4 p-2 bg-blue-500 text-white rounded">Manage Inventory</Link>
        </div>
    );
}

export default Home;
