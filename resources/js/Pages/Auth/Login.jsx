import { motion, AnimatePresence } from 'framer-motion';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { X, Check, LogIn, Key } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform z-[100] px-4 py-3 rounded-lg shadow-lg flex items-center ${
                type === 'success' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
            }`}
        >
            <span className="mr-2">
                {type === 'success' ? <Check size={18} /> : <X size={18} />}
            </span>
            <span>{message}</span>
            <button onClick={onClose} className="ml-3 hover:text-gray-200">
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [toast, setToast] = useState(status ? { message: status, type: 'success' } : null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onSuccess: () => {
                showToast('Login successful! Redirecting...');
            },
            onError: () => {
                showToast('Login failed. Please check your credentials.', 'error');
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <main className="flex-grow flex items-center justify-center p-6">
                <motion.div
                    className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-5 bg-blue-800 border-b flex items-center">
                        <LogIn className="h-6 w-6 text-white mr-3" />
                        <h2 className="text-xl font-bold text-white">Log In to Your Account</h2>
                    </div>

                    <div className="p-6">
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800 pl-10"
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </span>
                                </div>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800 pl-10"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Key size={18} />
                                    </span>
                                </div>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </div>

                            <div className="flex items-center mb-6">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-blue-800 hover:text-blue-900 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={processing}
                                    type="submit"
                                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md flex items-center"
                                >
                                    {processing ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <LogIn className="h-4 w-4 mr-2" />
                                    )}
                                    {processing ? 'Logging in...' : 'Log in'}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
