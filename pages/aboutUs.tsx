import React from 'react';
import YandexMap from '@/components/YandexMap';
import styles from '@/styles/About.module.css';
import Layout from '@/components/Layout';
import Head from 'next/head';
import CartSmall from '@/components/cartSmall';
import PhoneButton from '@/components/phoneButton';
import PlantsSlider from '@/components/PlantsSlider';



const AboutPage: React.FC = () => {
  return (
    <Layout>
        <Head>
        <title>Страница о питомнике хвойных растений в Анапе</title>
        <meta
          name="description" content="Описание питомника хвойных растений в Анапе"
        />
      </Head>
    <main className={styles.container}>
      <section className={styles.header}>
        <h1>О нас</h1>
        <p className={styles.subtitle}>
          Добро пожаловать в наш питомник хвойных растений — уголок природы и зелени!
        </p>
      </section>

      <section className={styles.content}>
        <article className={styles.text}>
          <h2>Наша миссия</h2>
          <p>
            Мы выращиваем и заботимся о самых красивых и здоровых хвойных растениях,
            чтобы дарить вам возможность окружить себя природной свежестью и уютом.
            В нашем питомнике вы найдете широкий выбор сосен, елей, пихт и других
            вечнозеленых красавцев.
          </p>

          <h2>Наше расположение</h2>
          <p>
            Мы находимся недалеко от Анапы и рады видеть вас в нашем питомнике по адресу,
            который вы можете увидеть на карте ниже.
          </p>

          <h2>Почему выбирают нас</h2>
          <ul>
            <li>Высокое качество и сорта растений</li>
            <li>Индивидуальный подход к каждому клиенту</li>
            <li>Консультации по уходу за хвойниками</li>
            <li>Доставка и посадка на месте</li>
          </ul>
        </article>
        {/* Карта яндекса через api (требует ключа (пароля - https://developer.tech.yandex.ru/services/3) формировать карту: https://yandex.ru/dev/maps/archive/doc/jsapi/2-0/ru/quick-start/): */}
        {/* <aside className={styles.mapWrapper}>
          <YandexMap />
        </aside> */}
        {/* Карта через конструктор карт яндекса - https://yandex.ru/map-constructor/, не требует ключа или пароля (вставлять в код через iframe, если через javaScript - то ломается верстка) */}
        <aside className={styles.mapWrapper}>
          <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab7c58a9b190226bc4c3e6b70b9bbe109d1266474714b9c508800e0b168d22e9e&amp;source=constructor" width="100%" height="100%" frameBorder="0"></iframe>
        </aside>
      </section>

      <section className={styles.info}>
        <div><CartSmall/></div>
        <div className={styles.buttonPhone}>
          <PhoneButton/>
        </div>
      </section>

      <section className={styles.slyder}>
        <h3>Наши растения:</h3>
        <PlantsSlider />
      </section>

    </main>
    
    </Layout>
  );
};

export default AboutPage;