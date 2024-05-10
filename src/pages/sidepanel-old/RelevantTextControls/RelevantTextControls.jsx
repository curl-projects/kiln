import { useEffect } from 'react';
import styles from './RelevantTextControls.module.css';
import { usePageRelevance } from './usePageRelevance';

export default function RelevantTextControls({ pageData, dataString, type }) {
  const { data, status, error, triggerRelevance } = usePageRelevance(pageData, dataString);

  useEffect(() => {
    console.log('DATA:', data);
  }, [data]);

  return (
    <div className={styles.relevanceControlPanel}>
      <p>Type: {type}</p>
      <button onClick={triggerRelevance}>Find relevance</button>
      {status === 'pending' && <p>Loading...</p>}
      {status === 'error' && <p>{error.message}</p>}
      {data &&
        data.map((el, idx) => (
          <p key={idx}>
            [Relevance: {el.relevance.toFixed(2)}]{el.query}
          </p>
        ))}
    </div>
  );
}
