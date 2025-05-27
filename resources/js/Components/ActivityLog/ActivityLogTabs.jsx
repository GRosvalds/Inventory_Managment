import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield } from 'lucide-react';

function ActivityLogTabs({ activeTab, onTabChange }) {
    return (
        <div className="flex flex-wrap border-b">
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onTabChange('users')}
                className={`flex items-center px-6 py-2 text-sm font-medium ${
                    activeTab === 'users'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Users size={18} className="mr-2" />
                User Logs
            </motion.button>
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onTabChange('moderators')}
                className={`flex items-center px-6 py-2 text-sm font-medium ${
                    activeTab === 'moderators'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Shield size={18} className="mr-2" />
                Moderator Logs
            </motion.button>
        </div>
    );
}

export default ActivityLogTabs;
