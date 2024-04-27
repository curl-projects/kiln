import React, { useEffect, useState } from 'react';

export const ChatResponse = (props) => {
    const [data, setData] = useState('');
    const [error, setError] = useState(null);
    const url = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/ai-completion`;
  
  function fetchAI(){
    const fetchData = async () => {
        if(props.goals.length > 0 && props.activeTabData.tabTitle && true){
        try {
            console.log("URL:", url)
            const response = await fetch(url);
            const reader = response.body.getReader();

            // A function to read the stream data
            const readStream = async () => {
                try {
                    const { done, value } = await reader.read();
            
                    const chunk = new TextDecoder().decode(value);

                    const eventLines = chunk.toString()
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line) => {
                          if (line.startsWith('data: ')) return null
                          return line.split('event: ').join('')
                    })
                    .filter(Boolean);


                    console.log("EVENT LINES:", eventLines, eventLines[0] === 'close')
                    if (eventLines[0] === 'close') {
                        // When no more data, exit the function
                        console.log('Stream finished.');
                        return;
                    }
                    // Decode the stream data and append it to state

                    const lines = chunk.toString()
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line) => {
                          if (!line.startsWith('data: ')) return null
                          return line.split('data: ').join('')
                    })
                    .filter(Boolean);
                    console.log("LINES:", lines, done)
                                    
                    lines.forEach((line) => {
                        setData(prevData => prevData + line)
                    })

                    // Read the next chunk of data
                    readStream();
                } catch (e) {
                    setError('Failed to read the stream.');
                    console.error('Error reading the stream:', e);
                }
            };

                readStream();
            } catch (e) {
                setError('Failed to fetch data.');
                console.error('Fetch failed:', e);
            }
        }
    };

    fetchData();
    };

  
  return (
    <>
      <button onClick={fetchAI}>Fetch AI</button>
      <p>{data}</p>

    </>
  );
};

