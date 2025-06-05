import React from 'react';

function InventoryCheckTable({ logs, isLoading, onViewDetails }) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (!logs.length) {
        return <div className="text-center text-gray-500 py-8">No inventory check history found.</div>;
    }

    return (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
            <tr className="bg-blue-800 text-white">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Action</th>
                <th className="py-3 px-4"></th>
            </tr>
            </thead>
            <tbody>
            {logs.map(log => (
                <tr key={log.id} className="border-b hover:bg-blue-50 transition">
                    <td className="py-2 px-4">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-2 px-4 truncate max-w-xs">{log.description}</td>
                    <td className="py-2 px-4 capitalize">{log.action.replace('_', ' ')}</td>
                    <td className="py-2 px-4">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition"
                            onClick={() => onViewDetails(log)}
                        >
                            View
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default InventoryCheckTable;
