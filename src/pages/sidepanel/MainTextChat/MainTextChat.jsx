import ContentEditable from 'react-contenteditable';
import styles from './MainTextChat.module.css'
import { useState, useEffect, useRef, useCallback } from 'react';
import { streamAIResponse } from '../../utils/streamAIResponse';

export default function MainTextChat(props){
    const [textState, setTextState] = useState("Any thoughts?");
    const [submittedTextState, setSubmittedTextState] = useState("")
    const [aiState, setAIState] = useState("Welcome")
    const contentEditable = useRef();
    const textStateRef = useRef(textState)

    useEffect(()=>{
        console.log("TEXT STATE:", textState)
        textStateRef.current = textState;
    }, [textState])

    const handleKeyPress = useCallback((e) => {
        let { key, keyCode } = e;
        console.log("KEY:", key)
        if(keyCode === 13 && !e.shiftKey){
            e.preventDefault() 
            console.log("KEYPRESS TEXT STATE:", textStateRef.current);
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
                <span style={{color: "#B9BCB8"}}>{!['Any thoughts?', ""].includes(submittedTextState) && submittedTextState.trim()}&nbsp;</span>
                {aiState}
            </h1>
            <div className={styles.mainTextLine}/>
            <div className={styles.userReplyWrapper}>
                {aiState !== "Welcome" && <p className={styles.chatAction} onClick={() => {
                    setSubmittedTextState("")
                    setAIState("")
                    setAIState("Welcome")
                }}>Clear Response</p>}
                <ContentEditable 
                    innerRef={contentEditable}
                    tagName="p"
                    html={textState}
                    className={styles.userReply}
                    onChange={(e)=>{
                        console.log("CHANGED:", e.target.value)
                        setTextState(e.target.value)
                    }}

                    onFocus={()=> {
                        console.log("FOCUSED")
                        if(textState === "Any thoughts?"){
                            setTextState("")
                    }
                    }}
                    onBlur={() => {
                        if(contentEditable.current.innerHTML === ""){
                            console.log("BLURRED:")
                            setTextState("Any thoughts?")
                        }
                    }}
                    onKeyDown={handleKeyPress}
                />
            </div>
        </div>
    )
}