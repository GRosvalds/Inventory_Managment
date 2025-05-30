import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const BasketItem = ({
                        item,
                        index,
                        itemVariants,
                        itemQuantities,
                        handleQuantityChange,
                        removeFromBasket,
                        showToast
                    }) => (
    <motion.div
        key={item.id}
        custom={index}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-row sm:flex-row items-center border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition bg-white gap-3"
        style={{ marginBottom: 0 }}
    >
        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
            {item.image ? (
                <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-md" />
            ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                </div>
            )}
        </div>
        <div className="flex-grow w-full">
            <h4 className="font-medium text-blue-800">{item.name}</h4>
            <p className="text-sm text-gray-500">{item.category}</p>
            <div className="mt-1 flex items-center text-sm">
                <span className="text-orange-500 font-medium">Available: {item.quantity}</span>
            </div>
            <div className="mt-2 flex items-center">
                <label className="text-sm text-gray-600 mr-2">Quantity:</label>
                <div className="relative w-20">
                    <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={itemQuantities[item.id] || 1}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-blue-800 focus:border-blue-800"
                    />
                    {(itemQuantities[item.id] || 1) > item.quantity && (
                        <div className="absolute right-0 top-0 h-full flex items-center pr-1">
                            <AlertTriangle size={12} className="text-red-500" />
                        </div>
                    )}
                </div>
                {(itemQuantities[item.id] || 1) > item.quantity && (
                    <span className="ml-2 text-red-500 text-xs">Exceeds available quantity</span>
                )}
            </div>
        </div>
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                removeFromBasket(item.id);
                showToast(`${item.name} removed from basket`);
            }}
            className="text-red-500 hover:text-red-700 p-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        </motion.button>
    </motion.div>
);

export default BasketItem;
