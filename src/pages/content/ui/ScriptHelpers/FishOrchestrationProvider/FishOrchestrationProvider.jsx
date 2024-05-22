import React, { createContext, useContext } from 'react';

// Create the context
const FishContext = createContext();

// Custom hook to use the FishContext
export const useFish = () => {
    return useContext(FishContext);
};

// Simple Event Emitter
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    emit(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(...args));
    }
}

const fishOrchestrator = new EventEmitter();

export default function FishOrchestrationProvider({ children }) {
    return (
        <FishContext.Provider value={{ fishOrchestrator }}>
            {children}
        </FishContext.Provider>
    );
}
