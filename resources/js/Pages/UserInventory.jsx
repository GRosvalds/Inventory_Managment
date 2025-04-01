import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Remove toast import
import InventoryList from '../Components/InventoryList';
import BasketButton from '../Components/BasketButton';
import BasketModal from '../Components/BasketModal';
import LeaseRequestModal from '../Components/LeaseRequestModal';
import LeaseExtensionModal from '../Components/LeaseExtensionModal';

function UserInventory() {
    const [items, setItems] = useState([]);
    const [basketItems, setBasketItems] = useState([]);
    const [isBasketOpen, setIsBasketOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/inventory');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            // Remove toast.error call
        } finally {
            setIsLoading(false);
        }
    };

    const addToBasket = (item) => {
        if (!basketItems.some(i => i.id === item.id)) {
            setBasketItems([...basketItems, item]);
            // Remove toast.success call
        } else {
            // Remove toast.error call
            // You can add an alert instead if needed
            alert(`${item.name} is already in your basket`);
        }
    };

    const removeFromBasket = (itemId) => {
        setBasketItems(basketItems.filter(item => item.id !== itemId));
    };

    const handleLeaseRequest = async (items, leaseDetails) => {
        try {
            // For multiple items
            if (Array.isArray(items)) {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + leaseDetails.duration);
                const formattedDate = endDate.toISOString().split('T')[0];

                // Create a batch request for all items
                await Promise.all(items.map(item =>
                    axios.post(`/api/inventory/${item.id}/lease`, {
                        userId: 1, // Replace with actual user ID from auth
                        leaseDuration: formattedDate,
                        purpose: leaseDetails.purpose
                    })
                ));

                // Remove toast.success call
                alert('Lease requests submitted successfully');
                setBasketItems([]);
                setIsBasketOpen(false);
            }
        } catch (error) {
            console.error('Error submitting lease request:', error);
            // Remove toast.error call
            alert('Failed to submit lease request');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Available Equipment</h1>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <InventoryList
                    items={items}
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

            <LeaseExtensionModal
                isOpen={isExtendModalOpen}
                onClose={() => setIsExtendModalOpen(false)}
                item={selectedItem}
            />
        </div>
    );
}

export default UserInventory;
