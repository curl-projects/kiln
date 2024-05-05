import { findHighestRelevance } from '../../api-funcs/relevance.js';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export function usePageRelevance(pageData, dataString) {
    const [triggerFetch, setTriggerFetch] = useState(false);

    const { status, isSuccess, isError, isPending, data, error } = useQuery({
        queryKey: ['relevance', pageData, triggerFetch],
        queryFn: () => findHighestRelevance(pageData.map(e => e.text), dataString),
        enabled: triggerFetch && Boolean(pageData),
    });


    useEffect(()=>{
        console.log("TRIGGER FETCH", triggerFetch)
    }, [triggerFetch])

    // useEffect(()=>{
    //     setTriggerFetch(false);
    // }, [isSuccess, isError, isPending])




    // Function to trigger the fetch
    const triggerRelevance = () => {
        if (pageData) {
            setTriggerFetch(true);
        }
        else{
            console.error("PAGE DATA NOT DEFINED")
        }
    };

    return { status, isSuccess, isError, isPending, data, error, triggerRelevance };
}
