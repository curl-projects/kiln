import TaskHeader from "@pages/content/ui/GlobalComponents/TaskHeader/TaskHeader.jsx";

const styles = {
  taskBoxOuterWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  taskBoxInnerWrapper: {
    width: '100%',
    height: '100%',
    border: '1px solid #EEEEEC',
  },
};

export default function TaskBox() {
  return (
    <div className="taskBoxOuterWrapper" style={styles.taskBoxOuterWrapper}>
      <div className="taskBoxInnerWrapper" style={styles.taskBoxInnerWrapper}>
        <TaskHeader />
      </div>
    </div>
  );
}
