import { useMutation } from '@tanstack/react-query'

async function streamAIResponse(setterFunction, data, promptType){
    try{
        let url = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/stream-ai`

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                data: data,
                promptType: promptType
            }),
        }

        const response = await fetch(url, options);

        const readStreamOuter = async (response) => {
            let contentType = response.headers.get('content-type')

            if(contentType !== 'text/event-stream'){
                console.error('Response is not a stream:', contentType)
                return {}
            }  

            const reader = response.body.getReader();
            
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

                    console.log("EVENT LINES:", eventLines)
    
                    if (eventLines[0] === 'close') {
                        // When no more data, exit the function
                        return;
                    }
                    // Decode the stream data and append it to state
    
                    var lines = chunk.toString()
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line) => {
                            if (!line.startsWith('data: ')) return null
                            return line.split('data: ').join('')
                    })
                    .filter(Boolean);

                    function removeLastUndefined(arr) {
                        if (arr.length > 0 && arr[arr.length - 1] === "undefined") {
                            arr.pop();
                        }
                        return arr;
                    }
                    
                    lines = removeLastUndefined(lines) 

                    console.log("LINES:", lines)
                    
                        lines.forEach((line) => {
                            setterFunction(prevData => prevData + line)
                        })
                        
                    // Read the next chunk of data
                    readStream();
    
                } catch (e) {
                    console.error('Error reading the stream:', e);
                }
            };

            readStream();
        }

        readStreamOuter(response)
    }
    catch(e){
        console.error("Stream AI Response Error:", e)
    }
}

export function useStreamAI() {
    const mutation = useMutation({
        mutationFn: ({ setterFunction, data, promptType }) => streamAIResponse(setterFunction, data, promptType)
    });

    return mutation;
}