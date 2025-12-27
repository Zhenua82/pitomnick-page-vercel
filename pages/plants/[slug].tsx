import { GetStaticPaths, GetStaticProps } from "next";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import Layout from "../../components/Layout";
import { plants, Plant, AgeKey } from "../../data/plants";
import styles from "../../styles/Plant.module.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { RootState } from "@/store";
import { useHoldButton2 } from "@/hooks/useHoldButton2";
import Head from "next/head";
import CartSmall from "@/components/cartSmall";
import PhoneButton from "@/components/phoneButton";
import Image from "next/image";

type Props = {
  plant: Plant | null;
};

const PlantPage: React.FC<Props> = ({ plant }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  /* =========================
     Available ages
  ========================= */

  const ages = useMemo<AgeKey[]>(() => {
    if (!plant) return [];
    return (Object.keys(plant.photo) as AgeKey[]).filter(
      (a) => a !== "взрослое растение"
    );
  }, [plant]);

  /* =========================
     Local state
  ========================= */

  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const { start, stop } = useHoldButton2();

  /* =========================
     Init qty from Redux cart
  ========================= */

  useEffect(() => {
    if (!plant) return;

    const initial: Record<string, number> = {};

    for (const age of ages) {
      const item = cartItems.find(
        (i) => i.slug === plant.slug && i.age === age
      );
      initial[age] = item?.quantity ?? 0;
    }

    setQty(initial);
  }, [plant, ages, cartItems]);

  /* =========================
     Redux update helper
  ========================= */

  const updateCart = useCallback(
    (age: AgeKey, newQty: number) => {
      if (!plant) return;

      dispatch(
        addItem({
          slug: plant.slug,
          age,
          title: plant.title,
          photo: plant.photo[age],
          price: parseInt(
            plant.cena[age].replace(/\D/g, ""),
            10
          ),
          quantity: newQty,
        })
      );
    },
    [dispatch, plant]
  );

  /* =========================
     Guards
  ========================= */

  if (!plant) {
    return (
      <Layout>
        <h2>Растение не найдено</h2>
        <Link href="/">Вернуться на главную</Link>
      </Layout>
    );
  }

  /* =========================
     Render
  ========================= */

  return (
    <Layout>
      <Head>
        <title>{plant.title} — купить саженцы</title>
        <meta
          name="description"
          content={`Покупайте ${plant.title} в питомнике`}
        />
      </Head>

      <div className={styles.header}>
        <h1>{plant.title}</h1>
        <p>{plant.podrobnoeOpisanie1}</p>
      </div>

      <div className={styles.content}>
        <section className={styles.gallery}>
          {ages.map((age) => {
            const currentQty = qty[age] || 0;

            return (
              <figure key={age} className={styles.figure}>
                <Image
                  src={plant.photo[age]}
                  alt={`${plant.title} — ${age}`}
                  width={300}
                  height={600}
                />

                <figcaption>
                  <strong>{age}</strong>
                  <div className={styles.price}>
                    {plant.cena[age]}
                  </div>
                </figcaption>

                {/* minus */}
                <button
                  className={styles.minus}
                  onMouseDown={() =>
                    start(() => {
                      setQty((prev) => {
                        const newQty = Math.max(0, (prev[age] || 0) - 1);

                        queueMicrotask(() => {
                          updateCart(age, newQty);
                        });

                        return { ...prev, [age]: newQty };
                      });
                    })
                  }
                  onMouseUp={stop}
                  onMouseLeave={stop}
                >
                  −
                </button>

                <span>{currentQty}</span>

                {/* plus */}
                <button
                  className={styles.plus}
                  onMouseDown={() =>
                    start(() => {
                      setQty((prev) => {
                        const newQty = Math.min(1000, (prev[age] || 0) + 1);

                        queueMicrotask(() => {
                          updateCart(age, newQty);
                        });

                        setAdded((p) => ({ ...p, [age]: true }));
                        setTimeout(() => {
                          setAdded((p) => ({ ...p, [age]: false }));
                        }, 800);

                        return { ...prev, [age]: newQty };
                      });
                    })
                  }

                  onMouseUp={stop}
                  onMouseLeave={stop}
                >
                  +
                </button>

                {added[age] && (
                  <div className={styles.addedFloating}>
                    Добавлено!
                  </div>
                )}
              </figure>
            );
          })}

          {/* adult plant */}
          <div className={styles.figure}>
            <Image
              src={plant.photo["взрослое растение"]}
              alt={`${plant.title} — взрослое растение`}
              width={300}
              height={600}
              priority
            />
            <strong>взрослое растение</strong>
          </div>
        </section>

        <section className={styles.details}>
          <CartSmall />
          <PhoneButton />
        </section>
      </div>

      <div className={styles.header}>
        <p>{plant.podrobnoeOpisanie2}</p>
      </div>
    </Layout>
  );
};

export default PlantPage;

/* =========================
   SSG
========================= */

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = Object.keys(plants);
  return {
    paths: slugs.map((s) => ({ params: { slug: s } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const plant = plants[slug] ?? null;

  return {
    props: {
      plant,
    },
  };
};
