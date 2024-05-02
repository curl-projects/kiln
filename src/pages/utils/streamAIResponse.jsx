import { useMutation } from '@tanstack/react-query'
 
export async function streamAIResponse(url, setterFunction, data, promptType){
    try{
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
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
                console.log("Reading Stream")
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
        mutationFn: ({ url, setterFunction, data, promptType }) => 
        streamAIResponse(url, setterFunction, data, promptType)
    });

    return mutation;
}