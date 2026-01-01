import Link from "next/link";
import styles from './cartSmall.module.css';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCheckout } from "./CheckoutContext";


const CartSmall: React.FC = () => {
  const { openCheckout } = useCheckout();
//Забираем колличество товара из локалсторадж:
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return (
        <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link href="/cart" className={styles.goCart} style={{textDecoration: 'none'}}><h2>Корзина</h2></Link>
              </div>
              <div style={{ marginTop: 12 }}>
                {cartItems.length === 0 && <p>Корзина пуста</p>}
                {cartItems.map((item) =>
                  item.quantity > 0 ? (
                    <div key={item.slug + item.age} className={styles.cartItem}>
                      <div className="meta">
                        <div className={styles.title}>{item.title}</div>
                        <div className="age">{item.age} - {item.quantity} шт.</div>
                      </div>
                    </div>
                  ) : null
                )}

                {cartItems.length > 0 && (
                  <>
                    <div className={styles.modalTotal}>Итого: <strong>{totalPrice} ₽</strong></div>

                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button className={styles.orderButton} onClick={openCheckout}>Оформить заказ</button>
                      {/* <button className={styles.orderButton} onClick={()=>console.log('OK vse!')}>Оформить заказ</button> */}
                    </div>
                  </>
                )}
              </div>
            </div>
  )
}
export default CartSmall
