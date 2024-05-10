import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/sidepanel/index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import SidePanel from '@root/src/pages/sidepanel-old/SidePanel.jsx';

refreshOnUpdate('pages/sidepanel');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(<SidePanel />);
}

init();
