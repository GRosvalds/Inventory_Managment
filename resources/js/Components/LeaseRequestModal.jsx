import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

function LeaseRequestModal({ isOpen, onClose, item }) {
    const [leaseDuration, setLeaseDuration] = useState(7); // Default 7 days
    const [leasePurpose, setLeasePurpose] = useState('');

    const handleLeaseRequest = async (e) => {
        e.preventDefault();

        try {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + parseInt(leaseDuration));
            const formattedDate = endDate.toISOString().split('T')[0];

            await axios.post(`/lease-requests`, {
                user_id: 1,
                inventory_id: item.id,
                requested_until: formattedDate,
                purpose: leasePurpose
            });

            alert('Lease request submitted successfully');
            onClose();
        } catch (error) {
            console.error('Error submitting lease request:', error);
            alert('Failed to submit lease request: ' +
                (error.response?.data?.error || 'Unknown error'));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            >
                <div className="p-4 bg-blue-50 border-b">
                    <h3 className="text-lg font-bold text-blue-800">Request to Lease Item</h3>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold">{item?.name}</h4>
                        <p className="text-sm text-gray-500">Category: {item?.category}</p>
                        <p className="text-sm text-gray-500">Description: {item?.description}</p>
                        <p className="text-sm text-gray-500">Available Quantity: {item?.quantity}</p>
                    </div>

                    <form onSubmit={handleLeaseRequest}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Lease Duration (days)</label>
                            <input
                                type="number"
                                value={leaseDuration}
                                onChange={(e) => setLeaseDuration(e.target.value)}
                                className="p-3 border rounded-lg shadow-sm w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Purpose</label>
                            <textarea
                                value={leasePurpose}
                                onChange={(e) => setLeasePurpose(e.target.value)}
                                className="p-3 border rounded-lg shadow-sm w-full"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button type="submit" className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Submit</button>
                            <button type="button" onClick={onClose} className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">Cancel</button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default LeaseRequestModal;
