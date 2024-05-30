import React, { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';
import { useExtensionSync } from '../ContentSyncProvider/ContentSyncProvider';

export default function ContentTimer() {
  const { syncState, triggerExtensionAction } = useExtensionSync();

  useEffect(() => {
    console.log('SYNC STATE:', syncState);
  }, [syncState]);

  const formatTime = time => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
  };

  return (
    <div className={'timerRow'}>
      <div className={'timerBox'}>
        <p className={'timer'}>{syncState.time ? formatTime(syncState.time) : formatTime(0)}</p>
        {/* <p className={"timerEyebrow}>Current</p> */}
      </div>
      <div className={'playButtonBox'} onClick={() => {}}>
        {syncState?.isActive ? (
          <p className={'playButton'} style={{ left: '0px' }} onClick={() => triggerExtensionAction('pauseTimer')}>
            <FaPause />
          </p>
        ) : (
          <p className={'playButton'} onClick={() => triggerExtensionAction('startTimer')}>
            <FaPlay />
          </p>
        )}
      </div>
    </div>
  );
}
