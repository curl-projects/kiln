import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ContentEditable from 'react-contenteditable';
import { debounce } from 'lodash'; // Make sure to install lodash

export default function AutosaveText(props) {
    const [textState, setTextState] = useState(props.content || "Untitled");

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

    // useEffect(() => {
    //     console.log("TEXT STATE:", textState);
    // }, [textState]);

    const textMutation = useMutation({
        mutationFn: props.mutationFn,
        onSuccess: () => {
            console.log("Success");
        },
        onError: (error) => {
            console.error("Mutation Error", error);
            // Optionally reset textState to the last known good state or show error
        }
    });

    const handleChange = (e) => {
        const newText = e.target.value;
        setTextState(newText);
        debouncedSave(newText);
    };

    return (
        <ContentEditable
            tagName='p'
            html={textState}
            className={props.className}
            onChange={handleChange}
        />
    );
}
