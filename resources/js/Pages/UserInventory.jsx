import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryList from '../Components/InventoryList';
import BasketButton from '../Components/BasketButton';
import BasketModal from '../Components/BasketModal';
import LeaseRequestModal from '../Components/LeaseRequestModal';
import LeaseExtensionModal from '../Components/LeaseExtensionModal';
import {Footer, Header} from "@/Components/HeaderFooter.jsx";

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
        } finally {
            setIsLoading(false);
        }
    };

    const addToBasket = (item) => {
        if (!basketItems.some(i => i.id === item.id)) {
            setBasketItems([...basketItems, item]);
            alert(`${item.name} added to basket`);
        } else {
            alert(`${item.name} is already in your basket`);
        }
    };

    const removeFromBasket = (itemId) => {
        setBasketItems(basketItems.filter(item => item.id !== itemId));
    };

    const handleLeaseRequest = async (items, leaseDetails) => {
        try {
            if (Array.isArray(items)) {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + leaseDetails.duration);
                const formattedDate = endDate.toISOString().split('T')[0];

                await Promise.all(items.map(item =>
                    axios.post(`/lease-requests`, {
                        user_id: 1,
                        inventory_id: item.id,
                        requested_until: formattedDate,
                        purpose: leaseDetails.purpose
                    })
                ));

                alert('Lease requests submitted successfully');
                setBasketItems([]);
                setIsBasketOpen(false);
            }
        } catch (error) {
            console.error('Error submitting lease request:', error);
            alert('Failed to submit lease request');
        }
    };

    return (
        <div>
            <Header />
            <div className="container mx-auto p-4">
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
            </div>
            <Footer />
        </div>

    );
}

export default UserInventory;
