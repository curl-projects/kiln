export default function Separator({ paddingLeft }) {
    return(
      <div 
        className="separatorWrapper" 
        
        style={{ ...styles.separatorWrapper, paddingLeft: paddingLeft ? paddingLeft : "20px" }}
      >
        <div className="separatorTerminator" style={styles.separatorTerminator}/>
        <div className="separatorLine" style={styles.separatorLine}/>
      </div>
    );
  }
  
  const styles = {
    separatorWrapper: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      paddingBottom: '20px',
      paddingTop: '10px',
    },
    separatorTerminator: {
      height: '3px',
      width: '3px',
      borderRadius: '3px',
      border: '3px solid #7F847D',
    },
    separatorLine: {
      backgroundColor: '#7F847D',
      flex: 1,
      height: '3px',
    },
  };