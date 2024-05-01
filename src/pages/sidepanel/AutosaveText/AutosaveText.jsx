import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ContentEditable from 'react-contenteditable';
import { debounce } from 'lodash'; // Make sure to install lodash
import { streamAIResponse } from '../../utils/streamAIResponse';

export default function AutosaveText(props) {
    // TODO: avoid triggering when component first mounts

    const [textState, setTextState] = useState(props.content || "Capture your thoughts here!");
    const queryClient = useQueryClient()
    const isMounted = useRef(false);

    const generateAI = useCallback(() => {
        console.log("EXECUTING GENERATE AI")
        if(props.aiEnabled){
            setTextState("")
            let url = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/stream-ai`
            let data = props.aiData
            let promptType='description'
            streamAIResponse(url, setTextState, data, promptType)
            console.log("STREAM CONCLUDED:")   
        }
      }, [props.aiEnabled, props.aiData]);

    useEffect(() => {
        console.log("SETTING CHILD FUNCTION")
        props.setChildFunction && props.setChildFunction(() => generateAI)
    }, [props.setChildFunction])

    // Setup a debounced mutation function
    const debouncedSave = useCallback(debounce((newText) => {
        textMutation.mutate({
            objectId: props.objectId,
            field: props.field,
            value: newText
        });
    }, 1000), []); // 1000ms debounce time, adjust as needed

    useEffect(() => {
        setTextState(props.content || "Untitled");
    }, [props.content]);


    const textMutation = useMutation({
        mutationFn: props.mutationFn,
        onSuccess: (data, variables) => {
            const queryCache = queryClient.getQueriesData(['goals']);
            let currentQueryCache = queryCache.slice(-1)[0].slice(-1)[0]
            console.log("Success");
            console.log("SETTING QUERY DATA:", data)
            
            // update cache -- this only works for tasks
            let newData = {
                ...currentQueryCache,
            goals: currentQueryCache.goals.map(goal =>
                    goal.id === props.goalId ? {
                        ...goal,
                        tasks: goal.tasks.map(task =>
                            task.id === props.objectId ? {
                                ...task,
                                [props.field]: data[props.field]
                            } : task
                        )
                    } : goal
                )
            };

            console.log("NEW DATA:", newData)

    
            queryClient.setQueriesData(['goals'], newData)
        },
        onError: (error) => {
            console.error("Mutation Error", error);
        }
    });


    const handleChange = (e) => {
        const newText = e.target.value;
        setTextState(newText);
    };

    useEffect(()=>{
        if(isMounted.current){
            debouncedSave(textState);
        }
        else{
            isMounted.current = true;
        }
    }, [textState])

    return (
        <ContentEditable
            tagName='p'
            html={textState}
            className={props.className}
            onChange={handleChange}
        />
    );
}
