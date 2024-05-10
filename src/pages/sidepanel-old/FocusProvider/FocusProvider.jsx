import React, { createContext, useContext, useState, useEffect } from 'react';
import { useScriptSync } from '../ExtensionSyncProvider/ExtensionSyncProvider';

const FocusContext = createContext();

export const FocusProvider = ({ children }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const listeners = new Map(); // Stores event listeners
  const { syncState, useAutoUpdateSyncState, scriptAction } = useScriptSync();

  // one-directional auto update
  useAutoUpdateSyncState({ time });
  useAutoUpdateSyncState({ isActive });
  useAutoUpdateSyncState({ isFocused });

  useEffect(() => {
    switch (scriptAction) {
      case 'startTimer':
        startTimer();
        break;
      case 'pauseTimer':
        pauseTimer();
        break;
      default:
        break;
    }
  }, [scriptAction]);

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

  const startFocus = activeGoal => {
    setIsFocused(true);
    emit('focusStart', activeGoal);
  };

  const endFocus = activeGoal => {
    setIsFocused(false);
    emit('focusEnd', activeGoal);
  };

  const toggleFocus = () => {
    isFocused ? endFocus() : startFocus();
  };

  const startTimer = () => {
    setIsActive(true);
    emit('timerStart', time); // Emit 'start' event with the current time
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
    <FocusContext.Provider
      value={{
        time,
        isActive,
        startTimer,
        pauseTimer,
        resetTimer,
        toggleTimer,
        on,
        isFocused,
        startFocus,
        endFocus,
        toggleFocus,
      }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => useContext(FocusContext);
