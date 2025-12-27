import { useCheckout } from "../components/CheckoutContext";
import styles from './buttonOformtj.module.css';

export default function ButtonOformitj(){
    const { openCheckout } = useCheckout();
    return(
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className={styles.orderButton} onClick={openCheckout}>Оформить заказ</button>
        </div>
    )
}