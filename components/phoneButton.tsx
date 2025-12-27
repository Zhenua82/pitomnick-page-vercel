import styles from './phoneButton.module.css'

export default function PhoneButton(){
    return (
        <div className={styles.buttonContainer}>
            <a href="tel:+78910991929" className={styles.phoneButton}></a>
            <span>Имеются вопросы, звоните!</span>
        </div>
    )
}