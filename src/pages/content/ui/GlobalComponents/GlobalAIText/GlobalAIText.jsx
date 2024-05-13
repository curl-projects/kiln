import { useEffect, useContext } from "react";
import { BasePanelContext } from '@pages/content/ui/PanelLogic/PanelLogic.jsx';
import Firefly from "@pages/content/ui/ScriptHelpers/Firefly.jsx";

const styles = {
  AIWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
    paddingLeft: '24px',
    paddingBottom: '10px',
  },
  AIIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  AITextWrapper: {
    // Add styles here if needed
  },
  AIText: {
    color: '#898E87',
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '-0.06em',
    fontWeight: 550,
    margin: '0',
    fontFamily: "IBM Plex Mono, monospace"
  }
};

export default function GlobalAIText({ streamName, promptType }) {
  const streamOptions = {
    endpoint: '/stream-ai', 
    data: {}, 
    promptType: promptType || 'sayHello', 
    streamName: streamName
  };

  const { stream, ...contextData } = useContext(BasePanelContext);

  useEffect(() => {
    stream(streamOptions);
  }, []);

  useEffect(() => {
    console.log("CONTEXT DATA:", contextData, streamName)
  }, [contextData, streamName]);

  return (
    <div style={styles.AIWrapper}>
      <div style={styles.AIIconWrapper}>
        <Firefly />
      </div>
      <div style={styles.AITextWrapper}>
        <p style={styles.AIText}>
          {contextData[streamName] ? contextData[streamName] : "No Stream"}
        </p>
      </div>
    </div>
  );
}
