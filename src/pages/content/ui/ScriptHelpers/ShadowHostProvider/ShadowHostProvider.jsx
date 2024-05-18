import React, { createContext, useContext, useRef } from 'react';

// Create the context object
const ShadowHostContext = createContext(null);

// Custom hook to use the ShadowHostContext
export const useShadowHost = () => {
  const context = useContext(ShadowHostContext);
  if (!context) {
    throw new Error('useShadowHost must be used within a ShadowHostProvider');
  }
  return context;
};

// Provider component
export default function ShadowHostProvider({ children }){
  const shadowHostRef = useRef(null);

  return (
    <ShadowHostContext.Provider value={shadowHostRef}>
        {children}
    </ShadowHostContext.Provider>
  );
};