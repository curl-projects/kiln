import { find } from 'cheerio/lib/api/traversing';
import React, { useEffect, useState } from 'react';

export default function AIOrchestration(props){
    const [error, setError] = useState(null);

useEffect(()=>{
    console.error("Error:", error)
}, [error])

// whenever all relevant data changes, go fetch rankings
useEffect(() => {

    (async() => {
        console.log("FETCHING RANKINGS")
        // cleanup
        props.setGoalRanking(null)
        props.setActiveGoal(null)

        // fetch
        if(props.pageData?.length > 1 && props.goals.length > 0 && props.activeTabData.tabTitle){
            let inputURL = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/goal-ranking`;
            let AIResponse = await fetchAIResponse(inputURL, props.setGoalRanking, {streamed: false, aiTask: "goal-ranking"})
            console.log("GOAL RANKING RESPONSE!", AIResponse)
            AIResponse && props.setGoalRanking(AIResponse.goalsRelevance)
        }
    })()
}, [props.pageData, props.goals, props.activeTabData])

useEffect(()=>{
    // cleanup
    props.setActiveGoalSummary("")

    // fetch
    if(props.activeGoal){
        console.log("HELLO!")
        let inputURL = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/goal-relevance`; 
        fetchAIResponse(inputURL, props.setActiveGoalSummary, {streamed: true, aiTask: "goal-relevance"})
    }
}, [props.activeGoal])

  async function fetchAIResponse(url, setterFunction, aiOptions){
    setError(null)
    if(props.goals.length > 0 && props.activeTabData.tabTitle && props.pageData?.length > 1){
    try {
        console.log("URL:", url)
        
        const options = {
            'goal-ranking': {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    pageData: props.pageData.map((line) => line.text).join(' '),
                    goals: props.goals,
                    activeTabData: props.activeTabData
                }),
            },
            'goal-relevance': {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    pageData: props.pageData.map((line) => line.text).join(' '),
                    goal: props.goals ? props.goals.filter(goal => goal.id === props.activeGoal?.id)[0] : null,
                    activeTabData: props.activeTabData
                }),
            } 
        }[aiOptions.aiTask]

        console.log("OPTIONS:", {
            model: 'gpt-4',
            pageData: props.pageData.map((line) => line.text).join(' '),
            goal: props.goals ? props.goals.filter(goal => goal.id === props.activeGoal?.id) : null,
            activeTabData: props.activeTabData
        })
        
        const response = await fetch(url, options);
    
        const readStreamOuter = async (response) => {
            let contentType = response.headers.get('content-type')

            if(contentType !== 'text/event-stream'){
                setError('Response is not a stream:', contentType)
                return
            }        
            const reader = response.body.getReader();
            
            const readStream = async () => {
                console.log("Reading Stream (AIOrchestration.jsx)")
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
                    
                    if(!props.activeGoal){
                        props.setActiveGoalSummary("")
                    }
                    // Read the next chunk of data
                    readStream();
    
                } catch (e) {
                    setError('Failed to read the stream.');
                    console.error('Error reading the stream:', e);
                }
            };

            readStream();
        }

        const readResponse = async (response) => {
            console.log("Reading Response (AIOrchestration.jsx)")
            const responseJSON = await response.json();

            console.log("JSON RESPONSE:", responseJSON)

            const cleanJSONString = responseJSON.choices[0].message.content.replace(/\[\s*|\s*\]/g, '{').replace(/\s+/g, ' ');;

            console.log("CLEAN JSON STRING:", cleanJSONString)
            const cleanJSON = JSON.parse(cleanJSONString)

            console.log("CLEAN JSON:", cleanJSON)

            return cleanJSON
        }

        if(aiOptions.streamed){
            console.log("STREAMING!")
            readStreamOuter(response)
        }
        else{
            let AIResponse = await readResponse(response)
            return AIResponse
        }

        } catch (e) {
            setError('Failed to fetch data.');
            console.error('Fetch failed:', e);
        }
    }
    else{
        setError('Page does not have appropriate data loaded:', props.activeTabData, props.goals)
    }
};

  return (
    <>
      {/* <button onClick={fetchAI}>Fetch AI</button>
      {error 
      ? <p>Error: {error}</p> 
      : <p>{data}</p>
      } */}
    </>
  );
};

