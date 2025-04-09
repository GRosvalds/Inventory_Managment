import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import UserAvatar from './UserAvatar';

const DeleteConfirmationModal = ({ isOpen, onClose, user, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="p-4 bg-red-600 text-white rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center">
                        <AlertTriangle size={20} className="mr-2" />
                        Confirm Deletion
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col items-center mb-4">
                        {user && <UserAvatar name={user.name} />}
                        <h3 className="mt-4 font-bold text-lg">{user?.name}</h3>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>

                    <p className="text-gray-700 mb-6 text-center">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onConfirm(user.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete User
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteConfirmationModal;
