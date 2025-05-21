import { motion, AnimatePresence } from 'framer-motion';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Shield, Key } from 'lucide-react';
import { Toast } from '@/Components/LeaseRequestModal';

export default function TwoFactor({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
    });

    const [toast, setToast] = useState(status ? { message: status, type: 'success' } : null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('2fa.check'), {
            onSuccess: () => {
                showToast('Verification successful! Redirecting...');
            },
            onError: () => {
                showToast('Verification failed. Please check your code.', 'error');
            },
            onFinish: () => reset('code'),
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
                        <Shield className="h-6 w-6 text-white mr-3" />
                        <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
                    </div>

                    <div className="p-6">
                        <div className="mb-5">
                            <p className="text-gray-700 text-center">
                                Please enter the 6-digit verification code sent to your email.
                            </p>
                        </div>

                        <form onSubmit={submit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                                    Verification Code
                                </label>
                                <div className="relative">
                                    <input
                                        id="code"
                                        type="text"
                                        name="code"
                                        value={data.code}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800 pl-10"
                                        autoComplete="one-time-code"
                                        autoFocus
                                        onChange={(e) => setData('code', e.target.value)}
                                        maxLength={6}
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Key size={18} />
                                    </span>
                                </div>
                                {errors.code && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600"
                                    >
                                        {errors.code}
                                    </motion.p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-blue-800 hover:text-blue-900 hover:underline"
                                >
                                    Back to login
                                </Link>

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
                                        <Shield className="h-4 w-4 mr-2" />
                                    )}
                                    {processing ? 'Verifying...' : 'Verify Code'}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
