import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ContentEditable from 'react-contenteditable';
import { debounce } from 'lodash'; // Make sure to install lodash
import { streamAIResponse } from '../../utils/streamAIResponse';

export default function AutosaveText(props) {
    // TODO: avoid triggering when component first mounts

    const [textState, setTextState] = useState(props.content);
    const queryClient = useQueryClient()
    const isMounted = useRef(false);

    // useEffect(()=>{
    //     console.log("TEXT STATE CHANGING", textState)
    // }, [textState])

    const generateAI = useCallback(() => {
        if(props.aiEnabled){
            setTextState("")
            let url = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/stream-ai`
            let data = props.aiData
            let promptType=props.promptType
            streamAIResponse(url, setTextState, data, promptType)
            console.log("STREAM CONCLUDED:")   
        }
        else{
            console.error("AI NOT ENABLED")
        }
      }, [props.aiEnabled, props.aiData]);

    useEffect(() => {
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
        if(props.updateType === 'link'){
            setTextState(props.content || "");
        }
        else if(props.updateType === 'task'){
            setTextState(props.content || "No description");
        }
        else{
            setTextState(props.content || "Untitled");
        }
    }, [props.content, props.updateType]);


    const textMutation = useMutation({
        mutationFn: props.mutationFn,
        onSuccess: (data, variables) => {
            const queryCache = queryClient.getQueriesData(['goals']);
            let currentQueryCache = queryCache.slice(-1)[0].slice(-1)[0]
            console.log("Success");
            console.log("SETTING QUERY DATA:", data)
            
            // update cache -- this only works for tasks
            if(props.updateType === 'task'){
                let newData = {
                    ...currentQueryCache,
                goals: currentQueryCache.goals.map(goal =>
                        goal.id === props.goalId ? {
                            ...goal,
                            tasks: goal.tasks.map(task =>
                                task.id === props.objectId ? {
                                    ...task,
                                    [props.field]: data.task[props.field]
                                } : task
                            )
                        } : goal
                    )
                };

                queryClient.setQueriesData(['goals'], newData)
            }
            else if(props.updateType === 'link'){
                // TODO: cache update
                let newData = {
                    ...currentQueryCache,
                    goals: currentQueryCache.goals.map(goal =>
                        goal.id === props.goalId ? {
                            ...goal,
                            tasks: goal.tasks.map(task =>
                                task.id === props.taskId ? {
                                    ...task,
                                    links: task.links.map(link =>
                                        link.id === props.linkId ? {
                                            ...link,
                                            [props.field]: props.newValue
                                        } : link
                                    )
                                } : task
                            )
                        } : goal
                    )
                };
                
                
                queryClient.setQueriesData(['goals'], newData)
            }
        
            else{
                console.error("No Update Type,", props.updateType)
            }

    
        },
        onError: (error) => {
            console.error("Mutation Error", error);
        },
        retry: 0,
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
