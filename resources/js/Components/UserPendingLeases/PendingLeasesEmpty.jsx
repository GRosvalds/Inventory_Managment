import React from 'react';

function PendingLeasesEmpty() {
    return (
        <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            <p className="text-gray-500 text-lg">No pending lease requests</p>
        </div>
    );
}

export default PendingLeasesEmpty;
