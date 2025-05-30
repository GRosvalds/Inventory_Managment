import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Toast from './Common/Toast';
import BasketList from './Basket/BasketList';
import BasketEmpty from './Basket/BasketEmpty';
import BasketLeaseForm from './Basket/BasketLeaseForm';

function BasketModal({ isOpen, onClose, basketItems, removeFromBasket, onRequestLease }) {
    const [leaseDuration, setLeaseDuration] = useState(7);
    const [leasePurpose, setLeasePurpose] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState(null);
    const [itemQuantities, setItemQuantities] = useState({});
    const itemsPerPage = 3;

    useEffect(() => {
        const quantities = {};
        basketItems.forEach(item => {
            quantities[item.id] = quantities[item.id] || 1;
        });
        setItemQuantities(quantities);
    }, [basketItems]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = basketItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(basketItems.length / itemsPerPage);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleQuantityChange = (itemId, quantity) => {
        setItemQuantities(prev => ({
            ...prev,
            [itemId]: quantity
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validQuantities = basketItems.every(item =>
            itemQuantities[item.id] > 0 && itemQuantities[item.id] <= item.quantity
        );
        if (!validQuantities) {
            showToast('Please check item quantities', 'error');
            return;
        }
        onRequestLease(basketItems, {
            duration: leaseDuration,
            purpose: leasePurpose,
            quantity: itemQuantities
        });
        showToast('Lease requests submitted successfully');
    };

    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: i => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.1, duration: 0.3 }
        })
    };

    return (
        <>
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-0 z-50">
                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] md:max-h-[90vh] overflow-hidden flex flex-col md:flex-row md:rounded-lg md:w-full md:max-w-4xl md:h-auto h-full"
                >
                    <div className="flex-1 flex flex-col h-full">
                        <div className="p-4 bg-blue-800 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Your Basket</h3>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(90vh-200px)]">
                            {basketItems.length === 0 ? (
                                <BasketEmpty />
                            ) : (
                                <BasketList
                                    currentItems={currentItems}
                                    itemVariants={itemVariants}
                                    itemQuantities={itemQuantities}
                                    handleQuantityChange={handleQuantityChange}
                                    removeFromBasket={removeFromBasket}
                                    showToast={showToast}
                                />
                            )}
                        </div>

                        {basketItems.length > 0 && (
                            <BasketLeaseForm
                                leaseDuration={leaseDuration}
                                setLeaseDuration={setLeaseDuration}
                                leasePurpose={leasePurpose}
                                setLeasePurpose={setLeasePurpose}
                                handleSubmit={handleSubmit}
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default BasketModal;
