import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            {/* Custom Logo */}
            <div className="mb-8 flex justify-center">
                <div className="text-3xl font-bold text-blue-800">
                    Inventory<span className="text-orange-500">Management</span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-semibold text-center mb-6 text-blue-800">Reset Your Password</h2>

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-gray-700" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full p-3 focus:ring-blue-800 focus:border-blue-800"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="New Password" className="text-gray-700" />

                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full p-3 focus:ring-blue-800 focus:border-blue-800"
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-800"
                            >
                                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                            </button>
                        </div>

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className="text-gray-700"
                        />

                        <div className="relative">
                            <TextInput
                                type={showConfirmPassword ? "text" : "password"}
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full p-3 focus:ring-blue-800 focus:border-blue-800"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-800"
                            >
                                {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                            </button>
                        </div>

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={processing}
                            className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition shadow-md disabled:opacity-70"
                        >
                            Reset Password
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </GuestLayout>
    );
}
