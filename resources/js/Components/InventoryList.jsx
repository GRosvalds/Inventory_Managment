import React from 'react';

function InventoryList({ items, onAddToBasket }) {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                            ) : (
                                <div className="text-4xl text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>

                            <div className="flex justify-between items-center mb-3">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {item.category}
                                </span>
                                <span className="text-sm font-medium">
                                    Qty: {item.quantity}
                                </span>
                            </div>

                            <button
                                onClick={() => onAddToBasket(item)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition duration-300 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                </svg>
                                Add to Basket
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InventoryList;
