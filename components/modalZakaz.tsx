"use client";

import React from "react";
import styles from "./modalZakaz.module.css";
import { CartItem } from "@/store/cartSlice";

type Props = {
  checkoutOpen: boolean;
  closeCheckout: () => void;
  items: CartItem[];
  totalPrice: number;
  phone: string;
  phoneError: string | null;
  setPhone: (value: string) => void;
  validatePhone: (value: string) => boolean;
  sendOrder: () => void;
};

const ModalZakaz: React.FC<Props> = ({
  checkoutOpen,
  closeCheckout,
  items,
  totalPrice,
  phone,
  phoneError,
  setPhone,
  validatePhone,
  sendOrder,
}) => {
  if (!checkoutOpen) return null;

  const filteredItems = items.filter((it) => it.quantity > 0);

  return (
    <div className={styles.checkoutOverlay} onClick={closeCheckout}>
      <div
        className={styles.checkoutWindow}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.checkoutHeader}>
          <div className={styles.checkoutTitle}>Оформление заказа</div>
          <button
            className={styles.checkoutCloseBtn}
            onClick={closeCheckout}
          >
            ×
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <p>Ваша корзина пуста.</p>
        ) : (
          <>
            <div className={styles.checkoutList}>
              {filteredItems.map((it) => (
                <div
                  key={it.slug + it.age}
                  className={styles.checkoutItem}
                >
                  <div className="meta">
                    <div className="title">{it.title}</div>
                    <div className="age">Возраст: {it.age}</div>
                  </div>
                  <div className="qty">
                    {it.quantity} × {it.price} ₽
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.checkoutTotal}>
              Итог: {totalPrice} ₽
            </div>

            <div className={styles.phoneRow}>
              <label htmlFor="phone">
                {/* Телефон (формат +7(XXX)XXX-XX-XX) */}
                Телефон
              </label>

              <input
                id="phone"
                className={styles.phoneInput}
                placeholder="+7(900)000-00-00"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) validatePhone(e.target.value);
                }}
              />

              <div className={styles.helpText}>
                Введите номер телефона для обратной связи
              </div>

              {phoneError && (
                <div style={{ color: "crimson", marginTop: 6 }}>
                  {phoneError}
                </div>
              )}

              <button
                className={styles.sendButton}
                onClick={sendOrder}
              >
                Отправить
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalZakaz;
