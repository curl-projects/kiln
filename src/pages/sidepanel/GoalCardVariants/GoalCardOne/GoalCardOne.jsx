import '@pages/sidepanel/GoalCardVariants/GoalCardOne/GoalCardOne.css';
import { FaRegClock } from "react-icons/fa6";

export default function GoalCardOne(){
    return(
    <div className='goalBox'>
        <div className='goalBadgeWrapper'>
            <div className='goalBadgeInnerCircle' />
            <div className='goalBadgeOuterCircle' />
        </div>
        <div className='goalMetadataWrapper'>
            <div className='goalMetadataLabelWrapper'>
            <p className='goalMetadataLabelIcon'><FaRegClock /></p>
            <p className='goalMetadataLabel'>Time</p>
            </div>
            <div style={{flex: 1}}/>
            <div className='goalMetadataNumberBox'>
            <p className='goalMetadataNumber'>12H</p>
            </div>
        </div>
        <div className='goalTitleWrapper'>
            <div className='goalTitleEyebrowWrapper'>
            <p className='goalTitleEyebrow'>Eyebrow</p>
            <div className='goalTitleEyebrowLine'/>
            </div>
            <div className='goalInnerTitleWrapper'>
            <p className='goalTitle'>Main Title</p>
            <div className='goalTitleLine'/>
            </div>
        </div>
        </div>
    )
}