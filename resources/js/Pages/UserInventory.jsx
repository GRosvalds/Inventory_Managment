import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryList from '../Components/InventoryList';
import BasketButton from '../Components/BasketButton';
import BasketModal from '../Components/BasketModal';
import LeaseRequestModal from '../Components/LeaseRequestModal';
import LeaseExtensionModal from '../Components/LeaseExtensionModal';
import { Layout } from "@/Components/HeaderFooter.jsx";
import SearchFilters from '@/Components/SearchFilters';
import { AnimatePresence } from 'framer-motion';
import { Toast } from '@/Components/LeaseRequestModal';

function UserInventory() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [basketItems, setBasketItems] = useState([]);
    const [isBasketOpen, setIsBasketOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        setFilteredItems(items);
    }, [items]);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/inventory');
            setItems(response.data);
            setFilteredItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            showToast('Failed to load inventory items', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const addToBasket = (item) => {
        if (!basketItems.some(i => i.id === item.id)) {
            setBasketItems([...basketItems, item]);
            showToast(`${item.name} added to basket`);
        } else {
            showToast(`${item.name} is already in your basket`, 'error');
        }
    };

    const removeFromBasket = (itemId) => {
        setBasketItems(basketItems.filter(item => item.id !== itemId));
    };

    const handleLeaseRequest = async (items, leaseDetails) => {
        try {
            if (Array.isArray(items)) {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + parseInt(leaseDetails.duration));
                const formattedDate = endDate.toISOString().split('T')[0];

                await Promise.all(items.map(item =>
                    axios.post(`/lease-requests`, {
                        user_id: 1,
                        inventory_id: item.id,
                        requested_until: formattedDate,
                        purpose: leaseDetails.purpose
                    })
                ));

                showToast('Lease requests submitted successfully');
                setBasketItems([]);
                setIsBasketOpen(false);
            }
        } catch (error) {
            console.error('Error submitting lease request:', error);
            showToast('Failed to submit lease requests', 'error');
        }
    };

    const handleFilterChange = (filters) => {
        let results = [...items];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            results = results.filter(item =>
                item.name.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower)
            );
        }

        if (filters.category) {
            results = results.filter(item => item.category === filters.category);
        }

        if (filters.availability === 'available') {
            results = results.filter(item => item.quantity > 0);
        } else if (filters.availability === 'limited') {
            results = results.filter(item => item.quantity > 0 && item.quantity <= 5);
        }

        setFilteredItems(results);
    };

    return (
        <Layout>
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <div className="container mx-auto">
                <SearchFilters onFilter={handleFilterChange} />

                <h1 className="text-2xl font-bold mb-6 text-blue-800">Available Equipment</h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                    </div>
                ) : (
                    <InventoryList
                        items={filteredItems}
                        onAddToBasket={addToBasket}
                    />
                )}

                <BasketButton
                    basketItems={basketItems}
                    onClick={() => setIsBasketOpen(true)}
                />

                <BasketModal
                    isOpen={isBasketOpen}
                    onClose={() => setIsBasketOpen(false)}
                    basketItems={basketItems}
                    removeFromBasket={removeFromBasket}
                    onRequestLease={handleLeaseRequest}
                />

                <LeaseRequestModal
                    isOpen={isRequestModalOpen}
                    onClose={() => setIsRequestModalOpen(false)}
                    item={selectedItem}
                />

                <LeaseExtensionModal
                    isOpen={isExtendModalOpen}
                    onClose={() => setIsExtendModalOpen(false)}
                    item={selectedItem}
                />
            </div>
        </Layout>
    );
}

export default UserInventory;
