import styles from './Link.module.css'

export default function Link({link, index}){
    return(
        <div className={styles.taskLinkWrapper} key={index}>
            <a className={styles.taskLinkTitle} href={link.url} target="_blank">{link.title}</a>
            <p onClick={()=>{}}>Generate Description</p>
            <p className={styles.taskLinkDescription} contentEditable>{link.description}</p>
        </div>
    )
}