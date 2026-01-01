import { GetServerSideProps } from "next";
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import Layout from "@/components/Layout";
import styles from "@/styles/Plant.module.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/cartSlice";
import { RootState } from "@/store";
import { useHoldButton2 } from "@/hooks/useHoldButton2";
import Head from "next/head";
import CartSmall from "@/components/cartSmall";
import PhoneButton from "@/components/phoneButton";
import Image from "next/image";
import { supabaseServer } from "@/lib/supabaseServer";
import type { Plant, PlantVariant } from "@/types/plant";


type Props = {
  plant: Plant | null;
};

/* =========================
   Page
========================= */

const PlantPage: React.FC<Props> = ({ plant }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { start, stop } = useHoldButton2();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});

  /* =========================
     Variants
  ========================= */

  const variants = useMemo(() => {
    return plant?.plant_variants.filter(
      (v) => v.age !== "взрослое растение"
    ) ?? [];
  }, [plant]);

  const adultVariant = useMemo(() => {
    return plant?.plant_variants.find(
      (v) => v.age === "взрослое растение"
    );
  }, [plant]);

  /* =========================
     Init qty from cart (SAFE)
  ========================= */

  useEffect(() => {
    if (!plant) return;

    const initial: Record<string, number> = {};

    for (const v of variants) {
      const item = cartItems.find(
        (i) => i.slug === plant.slug && i.age === v.age
      );
      initial[v.age] = item?.quantity ?? 0;
    }

    setQty(initial);
  }, [plant, variants, cartItems]);

  /* =========================
     Redux helper
  ========================= */

  const updateCart = useCallback(
    (variant: PlantVariant, newQty: number) => {
      dispatch(
        addItem({
          slug: plant!.slug,
          age: variant.age,
          title: plant!.title,
          photo: variant.photo,
          // price: variant.price,
          price: parseInt(String(variant.price).replace(/\D/g, ""), 10),
          quantity: newQty,
        })
      );
    },
    [dispatch, plant]
  );

  /* =========================
     Guard (ПОСЛЕ ХУКОВ)
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
          content={`Купить ${plant.title} в питомнике`}
        />
      </Head>

      <div className={styles.header}>
        <h1>{plant.title}</h1>
        {plant.podrobnoe_opisanie1 && (
          <p>{plant.podrobnoe_opisanie1}</p>
        )}
      </div>

      <div className={styles.content}>
        <section className={styles.gallery}>
          {variants.map((variant) => {
            const currentQty = qty[variant.age] || 0;

            return (
              <figure key={variant.age} className={styles.figure}>
                <Image
                  src={variant.photo}
                  alt={`${plant.title} — ${variant.age}`}
                  width={300}
                  height={600}
                />

                <figcaption>
                  <strong>{variant.age}</strong>
                  <div className={styles.price}>
                    {variant.price} ₽
                  </div>
                </figcaption>

                {/* minus */}
                <button
                  className={styles.minus}
                  onMouseDown={() =>
                    start(() => {
                      setQty((prev) => {
                        const newQty = Math.max(
                          0,
                          (prev[variant.age] || 0) - 1
                        );

                        queueMicrotask(() => {
                          updateCart(variant, newQty);
                        });

                        return { ...prev, [variant.age]: newQty };
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
                        const newQty = Math.min(
                          1000,
                          (prev[variant.age] || 0) + 1
                        );

                        queueMicrotask(() => {
                          updateCart(variant, newQty);
                        });

                        setAdded((p) => ({
                          ...p,
                          [variant.age]: true,
                        }));
                        setTimeout(() => {
                          setAdded((p) => ({
                            ...p,
                            [variant.age]: false,
                          }));
                        }, 800);

                        return { ...prev, [variant.age]: newQty };
                      });
                    })
                  }
                  onMouseUp={stop}
                  onMouseLeave={stop}
                >
                  +
                </button>

                {added[variant.age] && (
                  <div className={styles.addedFloating}>
                    Добавлено!
                  </div>
                )}
              </figure>
            );
          })}

          {adultVariant && (
            <div className={styles.figure}>
              <Image
                src={adultVariant.photo}
                alt={`${plant.title} — взрослое растение`}
                width={300}
                height={600}
                priority
              />
              <strong>взрослое растение</strong>
            </div>
          )}
        </section>

        <section className={styles.details}>
          <CartSmall />
          <PhoneButton />
        </section>
      </div>

      {plant.podrobnoe_opisanie2 && (
        <div className={styles.header}>
          <p>{plant.podrobnoe_opisanie2}</p>
        </div>
      )}
    </Layout>
  );
};

export default PlantPage;

/* =========================
   SSR
========================= */

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  const { data } = await supabaseServer
    .from("plants")
    .select(
      `
      id,
      slug,
      title,
      opisanie,
      podrobnoe_opisanie1,
      podrobnoe_opisanie2,
      plant_variants (
        age,
        photo,
        price
      )
    `
    )
    .eq("slug", slug)
    .single();

  return {
    props: {
      plant: data ?? null,
    },
  };
};
