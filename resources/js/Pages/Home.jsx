import React, { useEffect } from "react";
import { Link } from '@inertiajs/react';
import { motion } from "framer-motion";

function Home() {
    useEffect(() => {}, []);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <motion.header
                className="relative h-screen flex items-center justify-center text-center px-4 md:px-8"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-blue-900 opacity-5"></div>
                    <div className="absolute inset-0 bg-grid-pattern"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-blue-800">
                            Inventory <span className="text-orange-600">Management</span> System
                        </h1>
                    </motion.div>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Streamline your inventory operations with our comprehensive management solution.
                        Track items, manage users, and handle leases all in one place.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Link
                            href="/inventory"
                            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:-translate-y-1"
                        >
                            Manage Inventory
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </motion.header>

            <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Key Features</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our inventory system provides everything you need to manage your assets efficiently</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </section>

            <section className="py-16 px-4 md:px-8 bg-blue-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Follow these simple steps to get started</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {steps.map((step, index) => (
                            <StepCard key={index} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 md:px-8">
                <motion.div
                    className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="p-10 md:p-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to streamline your inventory management?</h2>
                        <p className="text-xl text-blue-100 mb-8">Start tracking your items, managing users, and optimizing your operations today.</p>
                        <Link
                            href="/inventory"
                            className="inline-block px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1"
                        >
                            Get Started Now
                        </Link>
                    </div>
                </motion.div>
            </section>

            <footer className="bg-gray-900 text-gray-300 py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Inventory Management System</h3>
                    <p className="mb-6">The complete solution for tracking and managing your inventory</p>
                    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

const FeatureCard = ({ feature, index }) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="text-blue-600 mb-4 inline-block p-3 bg-blue-50 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
        </motion.div>
    );
};

const StepCard = ({ step, index }) => {
    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
        >
            <div className="bg-white rounded-xl shadow-md p-8 relative z-10">
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
            </div>
            {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-5 w-10 h-2 bg-blue-200 z-0"></div>
            )}
        </motion.div>
    );
};

const features = [
    {
        title: "Item Tracking",
        description: "Track all your inventory items, their quantity, category, and estimated price with powerful search and filter capabilities.",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    },
    {
        title: "User Management",
        description: "Manage user accounts, permissions, and access control to ensure security and accountability within your system.",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    },
    {
        title: "Lease Tracking",
        description: "Easily lease items to users, track lease durations, and manage returns all in one seamless system.",
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    }
];

const steps = [
    {
        title: "Add Inventory Items",
        description: "Enter your items with details like name, description, quantity, and price."
    },
    {
        title: "Manage Users",
        description: "Add users who will be able to lease or manage inventory items."
    },
    {
        title: "Track & Report",
        description: "Use powerful reports to track item status, leases, and inventory changes."
    }
];

export default Home;
