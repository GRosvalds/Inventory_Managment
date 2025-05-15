import React from 'react';
import { motion } from 'framer-motion';

const StatCards = ({ stats }) => {
    const statCards = [
        { title: 'Total Items', value: stats.totalItems, color: 'text-blue-800' },
        { title: 'Leased Items', value: stats.leasedItems, color: 'text-orange-500' },
        { title: 'Missing Items', value: stats.missingItems, color: 'text-red-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-800"
                >
                    <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
                    <p className={`text-3xl font-bold ${card.color} mt-2`}>{card.value}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default StatCards;
