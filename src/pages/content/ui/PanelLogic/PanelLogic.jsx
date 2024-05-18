import React, { useContext } from 'react';
import ActiveTabProvider, { ActiveTabContext } from './ActiveTabProvider/ActiveTabProvider';
import ChromeSyncProvider, { ChromeSyncContext } from "./ChromeSyncProvider/ChromeSyncProvider.jsx"


export default function PanelLogic({ config, type, children }) {
  return (
    <ChromeSyncProvider config={config} type={type}>
      <ActiveTabProvider>
        {children}
      </ActiveTabProvider>
    </ChromeSyncProvider>
  );
}

export function useChromeSync(){
  const context = useContext(ChromeSyncContext);
  if(context === null){
    throw new Error("useChromeSync must be used within a BasePanelProvider")
  }

  return context
}

export function useActiveTab(){
  const context = useContext(ActiveTabContext);
    if(context === null){
      throw new Error("useActiveTab must be used within a ActiveTabProvider")
    }

  return context
}