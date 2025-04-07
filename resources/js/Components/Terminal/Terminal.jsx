import React from 'react';
import {motion} from 'framer-motion';
import {Terminal as TerminalIcon, Send, X} from 'lucide-react';

export default function Terminal({
                                     command,
                                     setCommand,
                                     output,
                                     handleCommand,
                                     handleKeyDown,
                                     outputContainerRef,
                                     isMinimized,
                                     toggleMinimize,
                                     onClose
                                 }) {
    const terminalVariants = {
        expanded: {height: 'auto', opacity: 1}, minimized: {height: '3rem', opacity: 1}
    };

    return (<motion.div
        className="bg-gray-900 text-green-400 rounded-lg shadow-lg border border-gray-800"
        variants={terminalVariants}
        initial="expanded"
        animate={isMinimized ? "minimized" : "expanded"}
        transition={{duration: 0.3}}
    >
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded-t-lg">
            <div className="flex items-center space-x-2">
                <TerminalIcon size={18} className="text-green-400"/>
                <h2 className="font-semibold text-white">Admin Terminal</h2>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={toggleMinimize}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition"
                >
                    {isMinimized ? '+' : '-'}
                </button>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition"
                >
                    <X size={16}/>
                </button>
            </div>
        </div>

        {!isMinimized && (<>
            <div
                ref={outputContainerRef}
                className="h-80 overflow-y-auto p-4 font-mono text-sm"
            >
                {output.map((line, index) => (<div
                    key={index}
                    className={line.startsWith('>') ? "text-blue-300 font-bold" : line.includes('error') || line.includes('invalid') ? "text-red-300" : line.includes('success') ? "text-green-500" : "text-green-300"}
                >
                    {line}
                </div>))}
            </div>
            <form onSubmit={handleCommand} className="p-2 flex border-t border-gray-800">
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">$</span>
                    <input
                        type="text"
                        className="w-full bg-gray-800 text-green-300 p-2 pl-8 rounded-md font-mono"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter command... (type 'help' for commands)"
                        autoFocus
                    />
                </div>
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    type="submit"
                    className="ml-2 bg-blue-700 text-white p-2 rounded-md hover:bg-blue-800 transition flex items-center"
                >
                    <Send size={16}/>
                </motion.button>
            </form>
        </>)}
    </motion.div>);
}
