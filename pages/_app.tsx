import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadPlants, restorePlantsFromLS } from "@/store/plantsSlice";
import { restoreCart, updateItemPrice } from "@/store/cartSlice";

const YM_ID = 97603974;

/* =========================
   Bootstrap (Redux-aware)
========================= */

function AppBootstrap({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const plants = useAppSelector((s) => s.plants.data);
  const plantsLoaded = useAppSelector((s) => s.plants.loaded);
  const cartItems = useAppSelector((s) => s.cart.items);

  /* =========================
     Restore plants from LS
  ========================= */

  useEffect(() => {
    dispatch(restorePlantsFromLS());
  }, [dispatch]);

  /* =========================
     Load plants from Supabase (once)
  ========================= */

  useEffect(() => {
    if (!plantsLoaded) {
      dispatch(loadPlants());
    }
  }, [plantsLoaded, dispatch]);

  /* =========================
     Restore cart (LS only)
  ========================= */

  useEffect(() => {
    dispatch(restoreCart());
  }, [dispatch]);

  /* =========================
     Sync cart prices AFTER plants loaded
  ========================= */

  useEffect(() => {
    if (!plantsLoaded) return;

    for (const item of cartItems) {
      const plant = plants[item.slug];
      if (!plant) continue;

      const priceStr = plant.cena[item.age];
      if (!priceStr) continue;

      const parsed = parseInt(priceStr.replace(/\D/g, ""), 10);
      if (Number.isNaN(parsed)) continue;

      if (parsed !== item.price) {
        dispatch(
          updateItemPrice({
            slug: item.slug,
            age: item.age,
            price: parsed,
          })
        );
      }
    }
  }, [plantsLoaded, plants, cartItems, dispatch]);

  /* =========================
     Yandex.Metrika
  ========================= */

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if ((window as any).ym) {
        (window as any).ym(YM_ID, "hit", url);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}

/* =========================
   App root
========================= */

export default function MyApp(props: AppProps) {
  return (
    <>
      {/* Yandex.Metrika */}
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              k=e.createElement(t); a=e.getElementsByTagName(t)[0];
              k.async=1; k.src=r; a.parentNode.insertBefore(k,a);
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${YM_ID}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `,
        }}
      />

      <Provider store={store}>
        <AppBootstrap {...props} />
      </Provider>
    </>
  );
}
