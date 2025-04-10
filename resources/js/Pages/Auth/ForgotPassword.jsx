import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto"
            >
                <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                    Forgot Password
                </h2>

                <div className="mb-6 text-gray-600 text-center">
                    Enter your email address and we'll send you a password reset link.
                </div>

                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg"
                    >
                        {status}
                    </motion.div>
                )}

                <form onSubmit={submit}>
                    <div className="mb-6">
                        <InputLabel
                            htmlFor="email"
                            value="Email"
                            className="text-gray-700"
                        />

                        <div className="relative mt-1">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="your@email.com"
                                className="block w-full p-3 focus:ring-blue-800 focus:border-blue-800 pl-10"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <Mail size={18} />
                            </div>
                        </div>

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={processing}
                        className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition shadow-md disabled:opacity-70"
                    >
                        Send Password Reset Link
                    </motion.button>
                </form>
            </motion.div>
        </GuestLayout>
    );
}
