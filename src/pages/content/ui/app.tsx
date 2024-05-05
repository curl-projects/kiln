import { useEffect } from 'react';
import ContentTimer from './ContentTimer/ContentTimer';
import ContentSyncProvider from './ContentSyncProvider/ContentSyncProvider';
import Draggable from 'react-draggable'; // The default

export default function App() {
  useEffect(() => {
    console.log('Content View Loaded');
  }, []);

  return (
  <ContentSyncProvider>
    <Draggable>
      <div className="outerControlWrapper">
        <ContentTimer />
      </div>
    </Draggable>
  </ContentSyncProvider>
  )
}
