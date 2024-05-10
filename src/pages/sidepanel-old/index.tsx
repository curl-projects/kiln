import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/sidepanel/index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import SidePanel from '@pages/sidepanel/SidePanel.jsx';
import ExtensionSyncProvider from './ExtensionSyncProvider/ExtensionSyncProvider.js';
import { FocusProvider } from './FocusProvider/FocusProvider.js';
refreshOnUpdate('pages/sidepanel');

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


function init() {
  const appContainer = document.querySelector('#app-container');

  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  if(appContainer instanceof HTMLElement){
    appContainer.style.position= 'relative';
  }

  const queryClient = new QueryClient();
  const root = createRoot(appContainer);
  root.render(
    <QueryClientProvider client={queryClient}>
      <ExtensionSyncProvider>
        <FocusProvider>
          <SidePanel />
        </FocusProvider>
      </ExtensionSyncProvider>
    </QueryClientProvider>
    
  );
}

init();
