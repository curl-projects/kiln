import React, { useState, useEffect } from 'react';
import styles from './Timer.module.css';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { useTimer } from '../TimerProvider/TimerProvider';

export default function Timer() {
    const { time, toggleTimer, isActive} = useTimer();


    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
    };


    return(
        <div className={styles.timerRow}>
            <div className={styles.timerBox}>
            <p className={styles.timer}>{formatTime(time)}</p>
            {/* <p className={styles.timerEyebrow}>Current</p> */}
            </div>
            <div className={styles.playButtonBox} onClick={toggleTimer}>
                {isActive 
                ? <p className={styles.playButton} style={{ left: "0px"}}><FaPause /></p>
                : <p className={styles.playButton}><FaPlay /></p>
                }
            </div>
        </div>
    );
}