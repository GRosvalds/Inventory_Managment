import { useState, useRef, useEffect, useCallback } from 'react';

export default function useTerminal(commandHandlers) {
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState(['> Welcome to Inventory Management Terminal', '> Type "help" for available commands']);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const outputContainerRef = useRef(null);

    const addOutput = useCallback((text) => {
        setOutput(prev => [...prev, text]);
    }, []);

    useEffect(() => {
        Object.keys(commandHandlers).forEach(cmd => {
            const originalHandler = commandHandlers[cmd];
            commandHandlers[cmd] = (args, _) => originalHandler(args, addOutput);
        });
    }, [commandHandlers, addOutput]);

    const executeCommand = (cmd) => {
        setHistory(prev => [cmd, ...prev].slice(0, 50));
        setHistoryIndex(-1);

        addOutput(`> ${cmd}`);

        if (!cmd.trim()) return;

        const args = cmd.trim().split(' ');
        const mainCommand = args[0].toLowerCase();

        if (mainCommand === 'clear') {
            setOutput([]);
            return;
        }

        if (commandHandlers[mainCommand]) {
            try {
                commandHandlers[mainCommand](args, addOutput);
            } catch (error) {
                addOutput(`Error executing command: ${error.message}`);
            }
        } else {
            addOutput(`Command not found: ${mainCommand}. Type "help" for available commands.`);
        }
    };

    const handleCommand = (e) => {
        e.preventDefault();
        if (!command.trim()) return;

        executeCommand(command);
        setCommand('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0 && historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCommand(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCommand(history[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCommand('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();

            const baseCommands = [
                'help', 'clear', 'status', 'list', 'search', 'add', 'delete', 'lease', 'refresh'
            ];

            const currentInput = command.toLowerCase().trim();
            if (currentInput) {
                const match = baseCommands.find(cmd => cmd.startsWith(currentInput));
                if (match) {
                    setCommand(match + ' ');
                }
            }
        }
    };

    useEffect(() => {
        if (outputContainerRef.current) {
            outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
        }
    }, [output]);

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const closeTerminal = () => {
        setIsVisible(false);
    };

    return {
        command,
        setCommand,
        output,
        handleCommand,
        handleKeyDown,
        outputContainerRef,
        isMinimized,
        toggleMinimize,
        isVisible,
        onClose: closeTerminal,
        addOutput
    };
}
