import { IoClose } from "react-icons/io5";

export function ConversationMessage({ text, name, setConversationMessage }){
    return(
        <div style={{
            height: 'fit-content', // Allow the height to adjust automatically
            minHeight: '30px', // Minimum height for the textarea
            width: 'fit-content',
            zIndex: 200,
            marginTop: "10px",
            padding: "10px",
            backgroundColor: '#F9F9F8',
            border: '2px solid #D2D1CD',
            lineHeight: '1.2em',
            borderRadius: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 36px 42px -4px rgba(77, 77, 77, 0.15)',
            fontWeight: 600,
            fontSize: '12px',
            color: "#63635E",
            display: 'flex',
            flexDirection: "column",
            alignSelf: name === 'Me' ? 'flex-start' : 'flex-end',
            gap: '4px',
            // overflow: 'hidden', // Hide scrollbars
            fontFamily: "monospace",

        }}>
            <div style={{ 
                fontWeight: 600,
                fontSize: '12px',
                color: "#FEAD82",
                margin: 0,
                width: '100%',
                fontFamily: "monospace",
                display: 'flex',
                alignItems: 'center',
            }}>
                <p style={{margin: 0}}>{name}</p>
                <div style={{ flex: 1}}/>
                <div 
                style={{
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: "rgba(77, 77, 77, 0.5)",
                    margin: 0,
                    }}
                onPointerDown={()=>{
                    setConversationMessage("")
                }}>
                    <IoClose />
                </div>
            </div>
            <p style={{ margin: 0, }}>
                {text}
            </p>
        </div>
    )
}