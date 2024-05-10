import styles from './Separator.module.css';

export default function Separator({ paddingLeft }) {
    return(
        <div className={styles.separatorWrapper} style={{
            paddingLeft: paddingLeft ? paddingLeft : "20px"
        }}>
            <div className={styles.separatorTerminator}/>
            <div className={styles.separatorLine}/>
        </div>
    )
}