import TaskButton from "../TaskButton/TaskButton.jsx";

const styles = {
  taskHeaderWrapper: {
    paddingTop: '26px',
    paddingBottom: '26px',
    paddingLeft: '16px',
  },
  taskHeaderEyebrowWrapper: {
    // Add styles here if needed
  },
  taskHeaderEyebrow: {
    // Add styles here if needed
  },
  taskTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitleCheckbox: {
    // Add styles here if needed
  },
  taskTitle: {
    margin: '0',
  },
  taskTitleUnderline: {
    width: '100%',
    height: '2px',
    backgroundColor: '#7F847D',
  },
  taskButtonRow: {
    // Add styles here if needed
  },
};

export default function TaskHeader() {
  return (
    <div className="taskHeaderWrapper" style={styles.taskHeaderWrapper}>
      <div className="taskHeaderEyebrowWrapper" style={styles.taskHeaderEyebrowWrapper}>
        <p className="taskHeaderEyebrow" style={styles.taskHeaderEyebrow}>Active Task</p>
      </div>
      <div className="taskTitleWrapper" style={styles.taskTitleWrapper}>
        <div className="taskTitleCheckbox" style={styles.taskTitleCheckbox} />
        <p className="taskTitle" style={styles.taskTitle}></p>
      </div>
      <div className="taskTitleUnderline" style={styles.taskTitleUnderline} />
      <div className="taskButtonRow" style={styles.taskButtonRow}>
        {['ai', 'log', 'notes'].map((type) => (
          <TaskButton type={type} active={false} key={type} />
        ))}
      </div>
    </div>
  );
}
