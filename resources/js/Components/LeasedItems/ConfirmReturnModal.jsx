import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function ConfirmReturnModal({ confirmReturn, handleReturnItem, setConfirmReturn }) {
    if (!confirmReturn) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
            >
                <div className="p-5 bg-orange-500 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Confirm Return</h3>
                    <button onClick={() => setConfirmReturn(null)} className="text-white hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="mb-4">
                        Are you sure you want to return <span className="font-bold">{confirmReturn.item?.name}</span>?
                    </p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setConfirmReturn(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => handleReturnItem(confirmReturn.id)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                            Confirm Return
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
