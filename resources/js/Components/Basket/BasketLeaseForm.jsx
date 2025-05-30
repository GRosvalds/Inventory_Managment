import React from 'react';
import { motion } from 'framer-motion';

const BasketLeaseForm = ({
                             leaseDuration,
                             setLeaseDuration,
                             leasePurpose,
                             setLeasePurpose,
                             handleSubmit
                         }) => (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lease Duration (days)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="90"
                        value={leaseDuration}
                        onChange={(e) => setLeaseDuration(parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-800 focus:border-blue-800"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose/Notes
                    </label>
                    <textarea
                        value={leasePurpose}
                        onChange={(e) => setLeasePurpose(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-800 focus:border-blue-800"
                        rows="3"
                        placeholder="Explain why you need these items..."
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition shadow-md"
                >
                    Request Lease for All Items
                </motion.button>
            </div>
        </form>
    </div>
);

export default BasketLeaseForm;
