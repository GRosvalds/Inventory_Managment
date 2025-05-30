import React from 'react';

const tabs = [
    { key: 'active', label: 'My Leases' },
    { key: 'pending', label: 'Pending Requests' }
];

function LeasedItemsTabs({ activeTab, setActiveTab }) {
    return (
        <div className="flex space-x-2">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition
                        ${activeTab === tab.key
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default LeasedItemsTabs;
