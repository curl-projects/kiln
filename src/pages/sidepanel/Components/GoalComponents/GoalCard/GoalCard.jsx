import styles from './GoalCard.module.css';
import { useState } from 'react';

export default function GoalCard(props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.goalBox}
      onClick={() => (props.isActive ? props.setActiveGoal(null) : props.setActiveGoal(props.goal))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className={styles.goalBadgeWrapper}>
        <div
          className={styles.goalBadgeInnerCircle}
          style={{
            backgroundColor: isHovered ? 'rgba(254, 172, 133, 0.5)' : '#EFF1EF',
          }}
        />
        <div
          className={styles.goalBadgeOuterCircle}
          style={{
            backgroundColor: isHovered ? 'rgba(254, 172, 133, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          }}
        />
      </div>
      <div className={styles.goalTitleWrapper}>
        <div className={styles.goalTitleEyebrowWrapper}>
          <p className={styles.goalTitleEyebrow}>{props.goal.category}</p>
          <div className={styles.goalTitleEyebrowLine} />
        </div>
        <div className={styles.goalInnerTitleWrapper}>
          <p
            className={styles.goalTitle}
            style={{
              color: isHovered ? 'rgba(254, 172, 133, 1)' : '#7F847D',
            }}>
            {props.goal.title}
          </p>
          <div
            className={styles.goalTitleLine}
            style={{
              backgroundColor: isHovered ? 'rgba(254, 172, 133, 1)' : '#7F847D',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function NewGoalCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.goalBox}
      style={{
        borderStyle: 'dashed',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className={styles.goalBadgeWrapper}>
        <div
          className={styles.goalBadgeInnerCircle}
          style={{
            backgroundColor: isHovered ? 'rgba(254, 172, 133, 0.5)' : '#EFF1EF',
          }}
        />
        <div
          className={styles.goalBadgeOuterCircle}
          style={{
            backgroundColor: isHovered ? 'rgba(254, 172, 133, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          }}
        />
      </div>
      <div className={styles.goalTitleWrapper}>
        <div className={styles.goalInnerTitleWrapper}>
          <p
            className={styles.goalTitle}
            style={{
              color: isHovered ? 'rgba(254, 172, 133, 1)' : '#b9bcb8',
            }}>
            Create a new goal on the homepage
          </p>
        </div>
      </div>
    </div>
  );
}