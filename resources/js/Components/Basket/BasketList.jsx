import React from 'react';
import BasketItem from './BasketItem';

const BasketList = ({
                        currentItems,
                        itemVariants,
                        itemQuantities,
                        handleQuantityChange,
                        removeFromBasket,
                        showToast
                    }) => (
    <div className="space-y-4">
        {currentItems.map((item, index) => (
            <BasketItem
                key={item.id}
                item={item}
                index={index}
                itemVariants={itemVariants}
                itemQuantities={itemQuantities}
                handleQuantityChange={handleQuantityChange}
                removeFromBasket={removeFromBasket}
                showToast={showToast}
            />
        ))}
    </div>
);

export default BasketList;
