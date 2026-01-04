import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './PlantsSlider.module.css';
import type { Plant } from "@/types/plant";

type Slide = {
  plantTitle: string;
  age: string;
  photo: string;
};

type Props = {
  plants: Plant[];
};

const PlantsSlider: React.FC<Props> = ({ plants }) => {
  /* =========================
     BASE SLIDES
  ========================= */

  const baseSlides: Slide[] = useMemo(() => {
    return plants.flatMap((plant) =>
      plant.plant_variants
        .filter((v) => v.age !== 'взрослое растение')
        .map((v) => ({
          plantTitle: plant.title,
          age: v.age,
          photo: v.photo,
        }))
    );
  }, [plants]);

  /* =========================
     STATE
  ========================= */

  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(3);
  const [animate, setAnimate] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  /* =========================
     RESPONSIVE
  ========================= */

  useEffect(() => {
    const update = () => {
      // const pv = window.innerWidth < 750 ? 1 : 3;
      const pv = window.innerWidth < 576 ? 1 : 3;
      setPerView(pv);
      setIndex(pv);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* =========================
     CLONES FOR INFINITE LOOP
  ========================= */

  const slides = useMemo(() => {
    if (baseSlides.length === 0) return [];

    const head = baseSlides.slice(0, perView);
    const tail = baseSlides.slice(-perView);

    return [...tail, ...baseSlides, ...head];
  }, [baseSlides, perView]);

  /* =========================
     NAVIGATION
  ========================= */

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((i) => i + 1);
  };

  const handleTransitionEnd = () => {
    setAnimate(false);

    if (index < perView) {
      setIndex(index + baseSlides.length);
    } else if (index >= baseSlides.length + perView) {
      setIndex(index - baseSlides.length);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimate(true);
        setIsAnimating(false);
      });
    });
  };

  /* =========================
     GUARD
  ========================= */

  if (slides.length === 0) return null;

  /* =========================
     RENDER
  ========================= */

  return (
    <div className={styles.slider}>
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{
            transform: `translateX(-${(100 / perView) * index}%)`,
            transition: animate ? 'transform 0.45s ease' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((slide, i) => (
            <div
              key={`${slide.plantTitle}-${slide.age}-${i}`}
              className={styles.slide}
              style={{ flex: `0 0 ${100 / perView}%` }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={slide.photo}
                  alt={`${slide.plantTitle} — ${slide.age}`}
                  fill
                  sizes={
                    perView === 1
                      ? '100vw'
                      : '(max-width: 1200px) 33vw, 400px'
                  }
                  className={styles.image}
                />
              </div>

              <div className={styles.caption}>
                <strong>{slide.plantTitle}</strong>
                <span>{slide.age}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={styles.prev}
        onClick={handlePrev}
        disabled={isAnimating}
        aria-label="Предыдущий слайд"
      >
        ‹
      </button>

      <button
        className={styles.next}
        onClick={handleNext}
        disabled={isAnimating}
        aria-label="Следующий слайд"
      >
        ›
      </button>
    </div>
  );
};

export default PlantsSlider;
