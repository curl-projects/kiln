import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const listeners = new Map();  // Stores event listeners

    // Function to add event listeners
    const on = (event, listener) => {
        if (!listeners.has(event)) {
            listeners.set(event, []);
        }
        listeners.get(event).push(listener);
    };

    // Function to emit events
    const emit = (event, data) => {
        if (listeners.has(event)) {
            listeners.get(event).forEach(listener => listener(data));
        }
    };

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    const startTimer = () => {
        setIsActive(true);
        emit('start', time);  // Emit 'start' event with the current time
    };

    const pauseTimer = () => {
        setIsActive(false);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTime(0);
    };

    const toggleTimer = () => {
        isActive ? pauseTimer() : startTimer();
    };

    return (
        <TimerContext.Provider value={{ time, isActive, startTimer, pauseTimer, resetTimer, toggleTimer, on }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
