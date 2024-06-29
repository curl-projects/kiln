import { useState, useEffect } from 'react';
import { stopEventPropagation } from 'tldraw';

export function WorldModelControlButton({idx, title, icon, activeIcon, setSelectedOutput, isActive}){
    const [isHovered, setIsHovered] = useState(false)
    
    return(
    <div key={idx} 
        onClick={(e) => {
            if(isActive){
                setSelectedOutput(null)
            }
            else{
                setSelectedOutput(title)
            }
    
            console.log("CLICKED!")
        }}
        className='tl-worldModel-controlButton'
        onMouseEnter={()=>{setIsHovered(true)}}
        onMouseLeave={()=>{setIsHovered(false)}}
    >
        <p style={{
            textTransform: "uppercase",
            fontSize: '10px',
            fontWeight: '600',
            color: "#9A98A0",
            margin: 0,
            transition: "all 0.3s ease-in-out",
            textShadow: (isActive || isHovered ) ? "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" : 'unset',
        }}>{title}</p>
        <div 
        style={{
            height: '38px',
            width: '38px',
            transition: "all 0.3s ease-in-out",
            borderRadius: '5px',
            border: (isActive || isHovered ) ? '1px solid #63635E': '1px solid #D5D4D0',
            boxShadow: (isActive || isHovered ) ? "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" : 'unset',
            backgroundColor: '#F9F9F8',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'    
        }}
        >
            {icon}
        </div>
    </div>  
    )
}