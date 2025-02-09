import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

function UserLeasedItems({ userId }) {
    const [leasedItems, setLeasedItems] = useState([]);

    useEffect(() => {
        fetchLeasedItems();
    }, []);

    const fetchLeasedItems = async () => {
        try {
            const response = await axios.get(`/api/user/${userId}/leased-items`);
            setLeasedItems(response.data);
        } catch (error) {
            console.error('Error fetching leased items:', error);
        }
    };

    return (
        <>
            <Head title="Leased Items" />
            <div className="p-6 text-center bg-gray-100 min-h-screen flex justify-center">
                <div className="max-w-4xl w-full">
                    <h1 className="text-4xl font-bold text-orange-600 mb-6">Leased Items</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-lg rounded-lg">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Description</th>
                                <th className="py-3 px-4">Quantity</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Estimated Price</th>
                                <th className="py-3 px-4">Lease Until</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leasedItems.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-100 transition duration-300">
                                    <td className="py-3 px-4">{item.name}</td>
                                    <td className="py-3 px-4">{item.description}</td>
                                    <td className="py-3 px-4">{item.quantity}</td>
                                    <td className="py-3 px-4">{item.category}</td>
                                    <td className="py-3 px-4">{item.estimated_price}</td>
                                    <td className="py-3 px-4">{item.pivot.lease_until}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserLeasedItems;
