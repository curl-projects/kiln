import { IoCaretBack } from 'react-icons/io5';

const styles = {
  goalBannerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTextWrapper: {
    width: '60%',
  },
  goalTextInnerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2px',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  goalTextInnerWrapperHover: {
    transform: 'scale(1.02)',
  },
  goalBackButton: {
    fontSize: '16px',
    color: '#CCCFCC',
    margin: '0',
    position: 'relative',
    top: '2px',
  },
  goalTitle: {
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: "14px",
    letterSpacing: '-0.06em',
    margin: '0',
    color: '#CCCFCC',
  },
  goalUnderline: {
    width: '100%',
    height: '2px',
    backgroundColor: '#CCCFCC',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
  },
  button: {
    border: '1px solid #B9BCB8',
    borderRadius: '600px',
    paddingLeft: '10px',
    paddingRight: '10px',
    cursor: 'pointer',
    transition: 'all 0.5s ease-in-out',
    flexShrink: '0',
  },
  buttonHover: {
    transform: 'scale(1.05)',
  },
  buttonText: {
    fontFamily: '"IBM Plex Mono", monospace',
    textTransform: 'uppercase',
    fontSize: '9px',
    fontWeight: '500',
    color: '#62605B',
    letterSpacing: '-0.02em',
  },
};

export default function GoalBanner({ activeGoal, setActiveGoal }) {
  return (
    <div className="goalBannerWrapper" style={styles.goalBannerWrapper}>
      <div className="goalTextWrapper" style={styles.goalTextWrapper}>
        <div
          className="goalTextInnerWrapper"
          style={styles.goalTextInnerWrapper}
          onMouseEnter={(e) => (e.currentTarget.style.transform = styles.goalTextInnerWrapperHover.transform)}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
          onClick={() => setActiveGoal(null)}
        >
          <p className="goalBackButton" style={styles.goalBackButton}>
            <IoCaretBack />
          </p>
          <p className="goalTitle" style={styles.goalTitle}>
            {activeGoal?.title || 'No Title'}
          </p>
        </div>
        <div className="goalUnderline" style={styles.goalUnderline} />
      </div>
      <div style={{ flex: 1 }} />
      <div className="buttonRow" style={styles.buttonRow}>
        {/* <div
          className="button"
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.transform = styles.buttonHover.transform)}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
        >
          <p className="buttonText" style={styles.buttonText}>
            Show Completed
          </p>
        </div>
        <div
          className="button"
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.transform = styles.buttonHover.transform)}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
        >
          <p className="buttonText" style={styles.buttonText}>
            Focus
          </p>
        </div> */}
      </div>
    </div>
  );
}
