import React, { useEffect, useRef } from 'react';

export default function TaskLog() {
  const mockLogData = [
    { id: 1, link: { url: 'https://www.google.com', title: 'Link title' }, notes: 'Notes', dateTime: '2021-09-01T00:00:00Z' },
    { id: 2, link: { url: 'https://www.google.com', title: 'Link title' }, notes: 'Notes', dateTime: '2022-09-01T00:00:00Z' },
    { id: 3, link: { url: 'https://www.google.com', title: 'Link title' }, notes: 'Notes', dateTime: '2023-09-01T00:00:00Z' },
    { id: 4, link: { url: 'https://www.google.com', title: 'Link title' }, notes: 'Notes', dateTime: '2023-09-01T00:00:00Z' },
    { id: 5, link: { url: 'https://www.google.com', title: 'Link title' }, notes: 'Notes', dateTime: '2023-09-01T00:00:00Z' },
    { id: 6, link: { url: 'https://www.google.com', title: 'Link title' }, notes: 'Notes', dateTime: '2023-09-01T00:00:00Z' }
  ];

  // Sort the log data from most recent to oldest
  const sortedLogData = mockLogData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  const groupedLogData = sortedLogData.reduce((acc, log) => {
    const date = new Date(log.dateTime);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(log);
    return acc;
  }, {});

  const formatTime = (dateTime) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateTime).toLocaleTimeString([], options).replace(' ', '');
  };

  const logWrapperRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const visibility = entry.intersectionRatio;

        // Adjust transformation based on the element's visibility
        const distortion = 1 - visibility;
        element.style.transform = `scale(${1 - 0.1 * distortion}) translateY(${distortion * 10}px)`;
        element.style.opacity = `${0.6 + 0.4 * visibility}`; // Gradually reduce opacity
      });
    }, { root: logWrapperRef.current, threshold: Array.from(Array(11), (_, i) => i / 10) });

    // Attach observer to each date and log item
    const dateHeaders = logWrapperRef.current.querySelectorAll('.log-date');
    const logItems = logWrapperRef.current.querySelectorAll('.log-item');
    dateHeaders.forEach(header => observer.observe(header));
    logItems.forEach(item => observer.observe(item));

    return () => observer.disconnect(); // Clean up observer on component unmount
  }, []);

  return (
    <div ref={logWrapperRef} style={styles.logWrapper}>
      {Object.entries(groupedLogData).map(([date, logs]) => (
        <div key={date}>
          <div className="log-date" style={{ display: 'flex', gap: '2px', alignItems: 'center', transition: 'transform 0.2s ease-out, opacity 0.2s ease-out' }}>
            <div style={styles.taskLogDateTriangle} />
            <h2 style={styles.taskLogDate}>{date}</h2>
          </div>
          {logs.map((log) => (
            <div key={log.id} className="log-item" style={styles.taskContentWrapper}>
              <p style={styles.taskContentTime}>- {formatTime(log.dateTime)}</p>
              <div style={{ flex: 1 }} />
              <div>
                <p style={styles.taskContentTitle}>{log.link.title}</p>
              </div>
              <div style={{ flex: 0.75 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const styles = {
  logWrapper: {
    maxHeight: '200px',
    overflowY: 'scroll',
    paddingTop: '40px',
    position: 'relative'
  },
  taskLogDateTriangle: {
    width: 0,
    height: 0,
    border: 'solid 8px',
    borderColor: 'transparent transparent transparent #7F847D',
  },
  taskLogDate: {
    color: '#7F847D',
    fontSize: '16px',
    letterSpacing: '-0.06em',
    fontWeight: 'bold',
    margin: 0,
  },
  taskContentWrapper: {
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out', // Smooth transition effect
  },
  taskContentTime: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '16px',
    letterSpacing: '-0.06em',
    color: '#7F847D',
  },
  taskContentTitle: {
    color: '#898E87',
    fontSize: '16px',
    letterSpacing: '-0.06em',
    fontWeight: '500',
  }
};
