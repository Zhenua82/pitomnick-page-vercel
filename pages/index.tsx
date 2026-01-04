import React from 'react';
import Layout from '../components/Layout';
import PlantCard from '../components/PlantCard';
// import { plants } from '../data/plants';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import PhoneButton from '@/components/phoneButton';
import CartSmall from '@/components/cartSmall';
import { GetServerSideProps } from "next";
import { supabaseServer } from "@/lib/supabaseServer";
import type { Plant } from "@/types/plant";

// import { useAppDispatch } from '@/store/hooks';
// import React, { useEffect } from 'react';
// import { loadPlants } from '@/store/plantsSlice';

type Props = {
  plants: Plant[];
};

const HomePage: React.FC<Props> = ({ plants }) => {

  // const dispatch = useAppDispatch();
  //   useEffect(() => {
  //     dispatch(loadPlants());   
  //   }, [dispatch]);

  return (
    <Layout>
      <Head>
        <title>Питомник хвойных растений в Анапе — купить саженцы и растения</title>
        <meta
          name="description" content="Большой выбор хвойных саженцев и растений в питомнике Анапы. Заказать саженцы онлайн с доставкой по региону. Гарантия качества и лучшие цены!"
        />
      </Head>
      <section className={styles.hero}>
        <h1>Питомник хвойных растений</h1>
        <p>Короткое приветствие — лучшие саженцы ели, сосны и можжевельника.</p>
      </section>

      <section>
        <h2 className={styles.h2}>Наши растения:</h2>
      <div className={styles.grid}>
        {plants.map((p) => {
          const adultVariant = p.plant_variants.find(
            (v) => v.age === "взрослое растение"
          );

          if (!adultVariant) return null;

          return (
            <PlantCard
              key={p.slug}
              slug={p.slug}
              title={p.title}
              image={adultVariant.photo}
              opisanie={p.opisanie ?? ""}
            />
          );
        })}
      </div>
      </section>

      <section className={styles.info}>
        <div>
          <h2 className={styles.h2}>Почему мы</h2>
          <ul>
            <li>Качественные саженцы</li>
            <li>Доставка и консультации по посадке</li>
            <li>Гарантии приживаемости на первое время</li>
          </ul>
        </div>
        <div><CartSmall/></div>
        <div className={styles.buttonPhone}>
          <PhoneButton/>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data, error } = await supabaseServer
    .from("plants")
    .select(`
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
    `)
    .order("title");

  if (error) {
    return { props: { plants: [] } };
  }

  return {
    props: {
      plants: data ?? [],
    },
  };
};