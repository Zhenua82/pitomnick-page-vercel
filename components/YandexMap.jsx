import React, { useEffect, useRef } from 'react';

const YandexMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.head.appendChild(script);
      });

    // Ваш API-ключ Яндекс.Карт
    const apiKey = process.env.NEXT_PUBLIC_YANDEXMAP;
    const ymapsSrc = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;

    loadScript(ymapsSrc)
      .then(() => {
        // Функция для ожидания готовности ymaps
        const waitForYmaps = () => {
          return new Promise((resolve, reject) => {
            const checkYmaps = () => {
              if (window.ymaps && typeof window.ymaps.ready === 'function') {
                resolve();
              } else {
                // Если ymaps еще не готов, подождем и проверим снова
                setTimeout(checkYmaps, 100);
              }
            };
            checkYmaps();
          });
        };

        waitForYmaps()
          .then(() => {
            if (!window.ymaps) {
              throw new Error('ymaps не определен после загрузки скрипта');
            }
            window.ymaps.ready(() => {
              if (!mapRef.current) return;
              const mapDiv = document.getElementById('map');
              if (!mapDiv) return;

              const myMap = new window.ymaps.Map('map', {
                center: [44.915870, 37.456766],
                zoom: 10,
              });

              const myPlacemark = new window.ymaps.Placemark(
                [44.915870, 37.456766],
                {
                  hintContent: 'Наш питомник хвойных растений',
                  balloonContent: 'Питомник под Анапой',
                },
                { preset: 'islands#redIcon' }
              );
              myMap.geoObjects.add(myPlacemark);
            });
          })
          .catch((err) => {
            console.error('Ошибка ожидания ymaps:', err);
          });
      })
      .catch((e) => {
        console.error('Ошибка загрузки Яндекс.Карт:', e);
      });
  }, []);

  return (
    <div
      id="map"
      ref={mapRef}
      style={{ width: '500px', height: '600px' }}
    />
  );
};

export default YandexMap;