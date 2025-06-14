import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

function LeaseExtensionModal({ isOpen, onClose, item }) {
    const [extensionDuration, setExtensionDuration] = useState(7); // Default 7 days

    const handleExtensionRequest = async (e) => {
        e.preventDefault();

        try {
            const endDate = new Date(item.pivot.lease_until);
            endDate.setDate(endDate.getDate() + parseInt(extensionDuration));
            const formattedDate = endDate.toISOString().split('T')[0];

            await axios.post(`/api/inventory/${item.id}/lease-extension`, {
                user_id: 1,
                end_date: formattedDate
            });

            alert('Lease extension request submitted successfully');
            onClose();
        } catch (error) {
            console.error('Error submitting extension request:', error);
            alert('Failed to submit lease extension request');
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
                <div className="p-4 bg-yellow-50 border-b">
                    <h3 className="text-lg font-bold text-yellow-800">Request Lease Extension</h3>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold">{item?.name}</h4>
                        <p className="text-sm text-gray-500">Category: {item?.category}</p>
                        <p className="text-sm text-gray-500">Description: {item?.description}</p>
                        <p className="text-sm text-gray-500">Current Lease Until: {new Date(item?.pivot?.lease_until).toLocaleDateString()}</p>
                    </div>

                    <form onSubmit={handleExtensionRequest}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Extension Duration (days)</label>
                            <input
                                type="number"
                                value={extensionDuration}
                                onChange={(e) => setExtensionDuration(e.target.value)}
                                className="p-3 border rounded-lg shadow-sm w-full"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button type="submit" className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">Submit</button>
                            <button type="button" onClick={onClose} className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">Cancel</button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default LeaseExtensionModal;
