import React, { useEffect, useMemo, useState } from 'react';
import styles from './PlantsSlider.module.css';
import { plants } from '@/data/plants';

type Slide = {
  plantTitle: string;
  age: string;
  photo: string;
};

/* Исключаем взрослые растения */
const baseSlides: Slide[] = Object.values(plants).flatMap((plant) =>
  Object.entries(plant.photo)
    .filter(([age]) => age !== 'взрослое растение')
    .map(([age, photo]) => ({
      plantTitle: plant.title,
      age,
      photo,
    }))
);

const PlantsSlider: React.FC = () => {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(3);
  const [animate, setAnimate] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  /* Адаптив */
  useEffect(() => {
    const update = () => {
      const pv = window.innerWidth < 750 ? 1 : 3;
      setPerView(pv);
      setIndex(pv);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* Клоны для бесконечности */
  const slides = useMemo(() => {
    const head = baseSlides.slice(0, perView);
    const tail = baseSlides.slice(-perView);
    return [...tail, ...baseSlides, ...head];
  }, [perView]);

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
        setIsAnimating(false); // ← РАЗРЕШАЕМ КЛИКИ
      });
    });
  };

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
              <img
                src={slide.photo}
                alt={`${slide.plantTitle} — ${slide.age}`}
                loading="lazy"
              />
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
