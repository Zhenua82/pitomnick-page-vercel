import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { RootState } from '../store';
import { updateQuantity, removeItem, clearCart, restoreCart } from '../store/cartSlice';
import styles from '../styles/Cart.module.css';
import Link from 'next/link';
//Зажатие кнопок добавления и убавления товара:
import { QtyControl } from "@/hooks/QtyControl";
import { store } from "@/store";
import Head from 'next/head';
import Image from "next/image";
import ButtonOformitj from '@/components/buttonOformitj';
import { useRouter } from 'next/router';

//Переход на главную страницу:
const useNavigateToMain = () => {
  const router = useRouter();
  const perehodGlavn = () => {
    router.push('/');
  };
  return perehodGlavn;
};

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    dispatch(restoreCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  //Переход на главную страницу:
  const perehodGlavn = useNavigateToMain();

  return (
    <Layout>
      <Head>
        <title>Корзина покупок в питомнике хвойных растений в Анапе</title>
        <meta
          name="description" content="Описание корзины покупок в питомнике хвойных растений в Анапе"
        />
      </Head>
      <h1>Корзина</h1>
      {items.length === 0 ? (
        <p style={{ marginTop: 20 }}>
          Корзина пуста. <Link href="/" style={{ color: '#2f855a' }}>Перейти к растениям</Link>
        </p>
      ) : (
        <>
          <div className={styles.list}>
            {items.map((item) => (
              <div key={item.slug + item.age} className={styles.card}>
                <Image
                                  src={item.photo}
                                  alt={`${item.title} — ${item.age}`}
                                  width={300}
                                  height={400}             
                                  priority={false}
                                  className={styles.photo}
                                />

                <div className={styles.info}>
                  <h3>{item.title}</h3>
                  <p className={styles.age}>Возраст: {item.age}</p>

                  <p className={styles.price}>
                    Цена: <strong>{item.price} ₽</strong>
                  </p>

                  <div className={styles.qtyRow}>
                    {/* Кнопки "-" и "+": */}
                    <QtyControl
                      onChange={(delta) => {
                        const current =
                          store
                            .getState()
                            .cart.items.find(
                              i => i.slug === item.slug && i.age === item.age
                            )?.quantity ?? 0;

                        const newQty = Math.min(1000, Math.max(0, current + delta));

                        dispatch(
                          updateQuantity({
                            slug: item.slug,
                            age: item.age,
                            qty: newQty,
                          })
                        );
                      }}
                    >
                      <span>{item.quantity}</span>
                    </QtyControl>
                  </div>

                  <p className={styles.subtotal}>
                    Сумма: <strong>{item.quantity * item.price} ₽</strong>
                  </p>

                  <button
                    className={styles.remove}
                    onClick={() => dispatch(removeItem({ slug: item.slug, age: item.age }))}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totalBox}>
            <h2>Итого: {total} ₽</h2>
            <div className={styles.wrapbutton}> 
              <button className={styles.clearBtn} onClick={() => dispatch(clearCart())}>
                Очистить корзину
              </button>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className={styles.addButton} onClick={perehodGlavn}>Добавить товар в корзину</button>
              </div>
              <ButtonOformitj/>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CartPage;