import { useState } from 'react';

const styles = {
  goalBox: {
    border: '1px solid #EEEEEC',
    minWidth: '180px',
    flex: 0,
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    cursor: 'pointer',
  },
  goalBoxHover: {
    transform: 'scale(1.05)',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
  },
  goalBadgeWrapper: {
    display: 'flex',
    height: '55px',
    width: '100%',
    position: 'relative',
    overflow: 'clip',
  },
  goalBadgeInnerCircle: {
    borderRadius: '100%',
    position: 'absolute',
    height: '110px',
    width: '110px',
    right: 0,
    top: 0,
    backgroundColor: '#EFF1EF',
    transform: 'translate(50%, -50%)',
    transition: 'all 0.5s ease-in-out',
  },
  goalBadgeOuterCircle: {
    borderRadius: '100%',
    position: 'absolute',
    height: '70px',
    width: '70px',
    right: 0,
    top: 0,
    transform: 'translate(50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.5s ease-in-out',
  },
  goalTitleWrapper: {
    marginTop: '10px',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingBottom: '20px',
    overflow: 'clip',
  },
  goalTitleEyebrowWrapper: {
    display: 'flex',
    marginLeft: '10px',
    flexDirection: 'column',
    width: '100%',
  },
  goalTitleEyebrow: {
    fontSize: '10px',
    color: '#B9BCB8',
    fontWeight: 'bold',
    letterSpacing: '-0.06em',
    lineHeight: '0px',
    marginBottom: '0.6em',
    marginTop: '0.6em',
  },
  goalTitleEyebrowLine: {
    width: '100%',
    height: '2px',
    backgroundColor: '#B9BCB8',
  },
  goalInnerTitleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '5px',
    width: '100%',
  },
  goalTitle: {
    fontSize: '16px',
    letterSpacing: '-0.06em',
    fontWeight: '500',
    position: 'relative',
    left: '4px',
    marginTop: '0px',
    marginBottom: '0px',
    paddingRight: '12px',
    lineHeight: '1.1em',
    transition: 'all 0.3s ease-in-out',
  },
  goalTitleLine: {
    width: '100%',
    height: '2px',
    transition: 'all 0.3s ease-in-out',
  },
};

export default function GoalCard(props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.goalBox,
        ...(isHovered ? styles.goalBoxHover : {})
      }}
      onClick={() => (props.isActive ? props.setActiveGoal(null) : props.setActiveGoal(props.goal))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div style={styles.goalBadgeWrapper}>
        <div
          style={{
            ...styles.goalBadgeInnerCircle,
            backgroundColor: isHovered ? 'rgba(254, 172, 133, 0.5)' : '#EFF1EF',
          }}
        />
        <div
          style={{
            ...styles.goalBadgeOuterCircle,
            backgroundColor: isHovered ? 'rgba(254, 172, 133, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          }}
        />
      </div>
      <div style={styles.goalTitleWrapper}>
        {/* <div style={styles.goalTitleEyebrowWrapper}>
          <p style={styles.goalTitleEyebrow}>{props.goal.category}</p>
          <div style={styles.goalTitleEyebrowLine} />
        </div> */}
        <div style={styles.goalInnerTitleWrapper}>
        <p
          className='goalTitle'
          style={{
            ...styles.goalTitle,
            color: isHovered ? 'rgba(254, 172, 133, 1)' : '#7F847D',
          }}
        >
          {props.goal.title}
        </p>
        <div
          style={{
            ...styles.goalTitleLine,
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
    style={{
      ...styles.goalBox,
      borderStyle: 'dashed',
      ...(isHovered ? styles.goalBoxHover : {})
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
    <div style={styles.goalBadgeWrapper}>
      <div
        style={{
          ...styles.goalBadgeInnerCircle,
          backgroundColor: isHovered ? 'rgba(254, 172, 133, 0.5)' : '#EFF1EF',
        }}
      />
      <div
        style={{
          ...styles.goalBadgeOuterCircle,
          backgroundColor: isHovered ? 'rgba(254, 172, 133, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        }}
      />
    </div>
    <div style={styles.goalTitleWrapper}>
      <div style={styles.goalInnerTitleWrapper}>
        <p
          style={{
            ...styles.goalTitle,
            color: isHovered ? 'rgba(254, 172, 133, 1)' : '#b9bcb8',
          }}
        >
          Create a new goal on the homepage
        </p>
      </div>
    </div>
  </div>
);
}
