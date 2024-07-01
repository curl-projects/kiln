import { handleFeedSearch } from '@pages/content/ui/ServerFuncs/api'
import { useState, } from 'react';
import { FeedCard } from './FeedCard';
import { stopEventPropagation } from '@tldraw/editor';

export function Feed({ queryResults, setQueryResults }){
    
    return(
        <div
        onPointerDown={(e) => {
            console.log("POINTER CLICKED")
            stopEventPropagation;
        }}
        onScroll={() => {
            console.log("SCROLLING")
            stopEventPropagation}
        }
        style={{
            height: '100%',
            width: '100%',
            border: '2px solid orange',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            position: "relative",
            overflow: 'scroll',
            // pointerEvents: 'none',
        }}>
            {/* inner feed */}
            {/* <div
            
                onScroll={(e)=>{
                    console.log("SCROLLING")
                    stopEventPropagation;
                    e.stopPropagation();
                }}
            
                style={{
                    height: '100%',
                    width: '100%',
                    border: '2px solid green',
                    overflow: "scroll",
                    pointerEvents: 'all',
                }}> */}
                {queryResults && queryResults.map((result, idx) => 
                   <FeedCard key={idx} idx={idx} result={result}/>
                )}
            {/* </div> */}
            {/* search bar */}
            <div 
            style={{
                position: 'absolute',
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                border: '2px solid pink',
                height: '24px',
                width: '80%',
                pointerEvents: 'all',
            }}
            onMouseDown={async()=>{
                console.log("SEARCH CLICKED")
                const results = await handleFeedSearch('hottest AI startups')
                setQueryResults(results)
            }}
            >
                Search
            </div>
        </div>
    )
}