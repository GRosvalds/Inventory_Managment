import React from 'react';
import { SearchX, FileX } from 'lucide-react';

export default function EmptyState({ searchTerm }) {
    return (
        <div className="text-center py-16">
            {searchTerm ? (
                <>
                    <SearchX className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500 text-lg">
                        No matching leases found
                    </p>
                    <p className="text-gray-400">
                        Try adjusting your search or filter criteria
                    </p>
                </>
            ) : (
                <>
                    <FileX className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500 text-lg">
                        No leases found in the system
                    </p>
                    <p className="text-gray-400">
                        Items will appear here when they are leased
                    </p>
                </>
            )}
        </div>
    );
}
