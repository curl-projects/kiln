import { useEffect, useState} from 'react';
import ContentTimer from './ContentTimer/ContentTimer';
import Draggable from 'react-draggable'; // The default
import AttentionalMaskControls from "./AttentionalMaskControls/AttentionalMaskControls.jsx"
import { useExtensionSync } from './ContentSyncProvider/ContentSyncProvider';
import Fish from './SwimmingComponent/Fishv3';

export default function App() {
  const [isHovered, setIsHovered] = useState(false);
  const { syncState } = useExtensionSync();


  useEffect(() => {
    console.log('SYNC STATE:', syncState);
  }, [syncState]);

  return (
      <Draggable>
        <div 
          className="outerControlWrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            opacity: isHovered ? 1 : 0.95,
          }}>
          <ContentTimer />
          <AttentionalMaskControls 
            type={'attentional-mask'}
            name="Attentional Masking"
            syncState={syncState}
          />
          <div className='fishBox'>
            <Fish />
          </div>
        </div>
      </Draggable>
  );
}
