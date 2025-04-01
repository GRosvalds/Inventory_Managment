import { useState, useRef, useEffect } from 'react';

export default function useTerminal(commandHandlers) {
    const [command, setCommand] = useState("");
    const [output, setOutput] = useState(["Welcome to Inventory Management System v1.0", "Type 'help' for a list of commands"]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const outputContainerRef = useRef(null);

    useEffect(() => {
        if (outputContainerRef.current) {
            outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
        }
    }, [output]);

    const addOutput = (text) => {
        setOutput(prev => [...prev, text]);
    };

    const handleCommand = async (e) => {
        e.preventDefault();
        if (!command.trim()) return;

        addOutput(`> ${command}`);

        setCommandHistory(prev => [...prev, command]);
        setHistoryIndex(-1);

        const args = command.split(' ');
        const cmd = args[0].toLowerCase();

        try {
            if (cmd === "clear") {
                setOutput([]);
            } else if (commandHandlers[cmd]) {
                await commandHandlers[cmd](args, addOutput);
            } else {
                addOutput(`Command not recognized: ${command}`);
                addOutput("Type 'help' for a list of available commands");
            }
        } catch (error) {
            addOutput(`Error: ${error.message}`);
        }

        setCommand("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCommand('');
            }
        }
    };

    return {
        command,
        setCommand,
        output,
        handleCommand,
        handleKeyDown,
        outputContainerRef,
        addOutput
    };
}
