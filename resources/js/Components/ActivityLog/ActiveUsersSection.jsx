import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, UserCircle } from 'lucide-react';

function ActiveUsersSection({ activeUsers, userType }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-blue-800 px-4 py-3 text-white flex items-center">
                <Activity size={20} className="mr-2" />
                <h3 className="font-semibold">Active {userType === 'moderators' ? 'Moderators' : 'Users'}</h3>
            </div>

            {activeUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>No active {userType} at the moment</p>
                </div>
            ) : (
                <div className="max-h-[500px] overflow-y-auto">
                    {activeUsers.map( user => (
                        <motion.div
                            className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    ) : (
                                        <UserCircle className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <div className="flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-green-400 mr-1"></div>
                                        <p className="text-xs text-gray-500">Active now</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActiveUsersSection;
