import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Shield, Activity, Clock, MapPin, AlertCircle, Info } from 'lucide-react';
import axios from 'axios';

function UserInfoModal({ ipAddress, user, logInfo, onClose }) {
    const [activeTab, setActiveTab] = useState('info');
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user && activeTab === 'activity') {
            fetchUserActivity();
        }
    }, [user, activeTab]);

    const fetchUserActivity = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/activity-logs?user_id=${user.id}`);
            setRecentActivity(response.data.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching user activity:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const getActionColor = (action) => {
        if (!action) return 'bg-gray-100 text-gray-800';

        switch (action.toLowerCase()) {
            case 'login':
                return 'bg-green-100 text-green-800';
            case 'logout':
                return 'bg-blue-100 text-blue-800';
            case 'create':
                return 'bg-purple-100 text-purple-800';
            case 'update':
                return 'bg-yellow-100 text-yellow-800';
            case 'delete':
                return 'bg-red-100 text-red-800';
            case 'view':
            case 'visited':
                return 'bg-blue-50 text-blue-600';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden"
            >
                <div className="p-5 bg-blue-800 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <User className="mr-2" size={20} />
                        User Information
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="border-b">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'info'
                                    ? 'border-b-2 border-blue-800 text-blue-800'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <User size={16} className="inline mr-1" /> Profile Info
                        </button>
                        <button
                            onClick={() => setActiveTab('current')}
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'current'
                                    ? 'border-b-2 border-blue-800 text-blue-800'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <AlertCircle size={16} className="inline mr-1" /> Current Action
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'activity'
                                    ? 'border-b-2 border-blue-800 text-blue-800'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Activity size={16} className="inline mr-1" /> Recent Activity
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col items-center">
                                <div className="bg-gray-200 rounded-full p-6 mb-4">
                                    <User size={64} className="text-gray-500" />
                                </div>
                                <h3 className="text-lg font-semibold">{user.name}</h3>
                                <p className="text-gray-500">{user.email}</p>

                                <div className="mt-4 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                                    <Shield size={14} className="mr-1" />
                                    {user.roles[0]?.name || 'User'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Account Status</h4>
                                    <p className="font-medium text-green-600">Active</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Registered Date</h4>
                                    <p>{formatDate(user.created_at)}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Last Active</h4>
                                    <p>{formatDate(user.last_login_at || user.updated_at)}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Last IP Address</h4>
                                    <div className="flex items-center">
                                        <MapPin size={14} className="mr-1 text-gray-400" />
                                        <span>{ipAddress || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'current' && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <h3 className="font-medium text-lg mb-3 flex items-center">
                                    <Info size={18} className="mr-2 text-blue-800" />
                                    Current User Activity
                                </h3>

                                {logInfo.action ? (
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Action Type</h4>
                                            <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full mt-1
                                                ${getActionColor(logInfo.action)}`}>
                                                {logInfo.action}
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Description</h4>
                                            <p className="text-gray-800 mt-1">{logInfo.description || 'No description available'}</p>
                                        </div>

                                        {logInfo.id && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Log Reference</h4>
                                                <p className="text-gray-800 mt-1">#{logInfo.id}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">No specific activity information available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div>
                            <h3 className="font-medium text-lg mb-4">Recent Activity</h3>

                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
                                </div>
                            ) : recentActivity.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <Activity className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-gray-500">No recent activity found</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                    <div className="divide-y divide-gray-200">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="p-4 hover:bg-gray-50">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full mr-2
                                                                ${getActionColor(activity.action)}`}>
                                                                {activity.action}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {activity.description || 'No description'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Clock size={14} className="mr-1" />
                                                        {formatDate(activity.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default UserInfoModal;
