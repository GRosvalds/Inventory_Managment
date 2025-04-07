import SidebarLayout from '@/Components/SidebarLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { motion } from 'framer-motion';
import { User, Lock, AlertTriangle } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <SidebarLayout>
            <Head title="Profile Settings" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-blue-800">Profile Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account settings and security preferences</p>
            </motion.div>

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-4 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center">
                        <User size={20} className="text-white mr-2" />
                        <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                    </div>
                    <div className="p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-3xl"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-4 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center">
                        <Lock size={20} className="text-white mr-2" />
                        <h2 className="text-xl font-semibold text-white">Update Password</h2>
                    </div>
                    <div className="p-6">
                        <UpdatePasswordForm className="max-w-3xl" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-4 bg-gradient-to-r from-red-700 to-red-600 flex items-center">
                        <AlertTriangle size={20} className="text-white mr-2" />
                        <h2 className="text-xl font-semibold text-white">Delete Account</h2>
                    </div>
                    <div className="p-6">
                        <DeleteUserForm className="max-w-3xl" />
                    </div>
                </motion.div>
            </div>
        </SidebarLayout>
    );
}
