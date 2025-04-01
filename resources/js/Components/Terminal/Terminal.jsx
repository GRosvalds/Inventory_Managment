// resources/js/components/Terminal.jsx
import React from 'react';

export default function Terminal({ command, setCommand, output, handleCommand, handleKeyDown, outputContainerRef }) {
    return (
        <div className="bg-black text-green-400 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-white mb-2">Admin Terminal</h2>
            <div
                ref={outputContainerRef}
                className="h-80 overflow-y-auto bg-gray-900 p-4 rounded-md font-mono text-sm"
            >
                {output.map((line, index) => (
                    <div key={index} className={line.startsWith('>') ? "text-blue-300 font-bold" : "text-green-300"}>
                        {line}
                    </div>
                ))}
            </div>
            <form onSubmit={handleCommand} className="mt-2 flex">
                <input
                    type="text"
                    className="w-full bg-gray-800 text-green-300 p-2 rounded-md font-mono"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter command... (type 'help' for commands)"
                    autoFocus
                />
                <button type="submit" className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    Execute
                </button>
            </form>
        </div>
    );
}
