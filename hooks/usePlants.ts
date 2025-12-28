import { useEffect, useState } from "react";
import type { Plant } from "@/types/plant";

// export type PlantVariant = {
//   age: string;
//   photo: string;
//   price: string;
// };

// export type Plant = {
//   id: string;
//   slug: string;
//   title: string;
//   opisanie: string | null;
//   podrobnoe_opisanie1: string | null;
//   podrobnoe_opisanie2: string | null;
//   plant_variants: PlantVariant[];
// };


export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/plants");
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data = await res.json();
        setPlants(data);
      } catch (e) {
        setError(`Не удалось загрузить растения. Ошибка: ${e}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { plants, loading, error };
};
