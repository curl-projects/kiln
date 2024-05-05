import ContentEditable from 'react-contenteditable';
import styles from './MainTextChat.module.css'
import { useState, useEffect, useRef, useCallback } from 'react';
import { streamAIResponse } from '../../utils/streamAIResponse';
import { useFocus } from '../FocusProvider/FocusProvider';
import { useStreamAI } from '../../utils/streamAIResponse';
import LinearProgress from '@mui/material/LinearProgress';
  

export default function MainTextChat(props){
    const [textState, setTextState] = useState("Any thoughts?");
    const [submittedTextState, setSubmittedTextState] = useState("")
    const [aiState, setAIState] = useState("Welcome")
    const contentEditable = useRef();
    const textStateRef = useRef(textState)
    const { on, time } = useFocus();
    const mutation = useStreamAI();
    const [hasAttention, setHasAttention] = useState(false);

    useEffect(()=>{
        let url = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/stream-ai`
        setAIState("")
        mutation.mutate({
            url: url,
            setterFunction: setAIState,
            data: {
                ...props.aiData
            },
            promptType: props.initialPrompt || "sayHello"
        })
    }, [])


    // TIMER MESSAGES
    useEffect(()=>{
        on('timerStart', () => {
            let url = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/stream-ai`
            let data = {
                timerEvent: "Timer started",
                time: time
            }
            setAIState("")
            mutation.mutate({
                url: url,
                setterFunction: setAIState,
                data: data,
                promptType: "timerChange"
            })
            setAIState("")
        })
    }, [on])

    useEffect(()=>{
        if(mutation.status === 'error'){
            console.error("MUTATION ERROR:", mutation.error.message)
        }
    }, [mutation.status])

    useEffect(()=>{
        textStateRef.current = textState;
    }, [textState])

    const handleKeyPress = useCallback((e) => {
        let { key, keyCode } = e;
        console.log("KEY:", key)
        if(keyCode === 13 && !e.shiftKey){
            e.preventDefault() 
            setAIState("")
            setSubmittedTextState(textStateRef.current)
            setTextState("")
          
            let url = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/stream-ai`
            let data = {...props.aiData, userMessage: textStateRef.current}
            let promptType = 'textChat'
            console.log("FRONTEND DATA:", data)
            streamAIResponse(url, setAIState, data, promptType)

    
            console.log("ENTER PRESSED")
            }
    }, [])
    
    return(
        <div className={styles.mainTextWrapper}>
            <h1 className={styles.mainText}>
                <span style={{color: "#B9BCB8"}}>{!['Any thoughts?', ""].includes(submittedTextState) && submittedTextState.trim().concat(" ")}</span>
                {aiState}
            </h1>
            {
                mutation.status === 'pending'
                ? 
                <>
                <LinearProgress  
                    sx={{
                        width: 'inherit',          
                        height: '2px',              
                        marginTop: '5px',  
                        position: 'relative',
                        top: "7px",         
                        backgroundColor: '#B9BCB8', 
                        '& .MuiLinearProgress-bar': {
                        backgroundColor: '#7F847D'
                        }
                    }} />
                <div className={styles.mainTextLine} style={{
                    backgroundColor: '#B9BCB8'}}/>
                </>
                : <div className={styles.mainTextLine}/>
            }

            <div className={styles.userReplyWrapper}
                onMouseEnter={()=>setHasAttention(true)}
                onMouseLeave={()=>setHasAttention(false)}
            >
                <div className={styles.userReplyTopLine} style={{
                        backgroundColor: hasAttention ? "rgba(254, 172, 133, 1)" : "#b9bcb8"
                    }}
                />
                <ContentEditable 
                    innerRef={contentEditable}
                    tagName="p"
                    html={textState}
                    className={styles.userReply}
                    onChange={(e)=>{
                        console.log("CHANGED:", e.target.value)
                        setTextState(e.target.value)
                    }}
                    style={{
                        color: hasAttention ? "rgba(254, 172, 133, 1)" : "#b9bcb8"
                    }}

                    onFocus={()=> {
                        if(textState === "Any thoughts?"){
                            setTextState("")
                        }
                        setHasAttention(true)
                    }}
                    onBlur={() => {
                        if(contentEditable.current.innerHTML === ""){
                            setTextState("Any thoughts?")
                        }
                        setHasAttention(false)

                    }}

                    onKeyDown={handleKeyPress}
                />
            </div>
        </div>
    )
}