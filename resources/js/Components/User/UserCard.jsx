import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Mail, Phone, Building, Lock, Unlock } from 'lucide-react';
import UserAvatar from './UserAvatar';

const UserCard = ({ user, onEdit, onDelete, onToggleBlock, onToggleUnblock, authUser }) => {
    const isBlocked = user.blocked_at !== null;
    const isSelf = authUser && authUser.id === user.id;

    return (
        isSelf ? null :
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-lg shadow-md overflow-hidden border flex flex-col h-full ${
                isBlocked ? 'border-red-200 bg-red-50' : 'border-gray-200'
            } hover:shadow-lg transition-shadow`}
        >
            <div className="p-6 flex-grow flex flex-col items-center">
                <UserAvatar name={user.name} />
                <h3 className="mt-4 font-bold text-lg text-blue-800">{user.name}</h3>
                <p className="text-gray-500 text-sm">{(user?.roles[0]?.name) || 'User'}</p>

                {isBlocked && (
                    <div className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Account Blocked
                    </div>
                )}

                <div className="mt-4 w-full space-y-2">
                    <div className="flex items-center text-sm">
                        <Mail size={16} className="mr-2 text-gray-400" />
                        <span className="text-gray-600 truncate">{user.email}</span>
                    </div>

                    {user.phone && (
                        <div className="flex items-center text-sm">
                            <Phone size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600">{user.phone}</span>
                        </div>
                    )}

                    {user.department && (
                        <div className="flex items-center text-sm">
                            <Building size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600">{user.department}</span>
                        </div>
                    )}
                </div>
            </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-center space-x-2 mt-auto">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(user)}
                        className="p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                    >
                        <Edit2 size={18} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(user)}
                        className="p-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                    >
                        <Trash2 size={18} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => isBlocked ? onToggleUnblock(user) : onToggleBlock(user)}
                        className={`p-2 rounded transition ${
                            isBlocked
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }`}
                        title={isBlocked ? "Unblock user" : "Block user"}
                    >
                        {isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
                    </motion.button>
                </div>
        </motion.div>
    );
};

export default UserCard;
