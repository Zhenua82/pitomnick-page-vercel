import { useEffect, useState } from "react";
import PlantEditor from "./PlantEditor";

export type AdminPlant = {
  id: string;
  slug: string;
  title: string;
  opisanie: string | null;
  podrobnoe_opisanie1: string | null;
  podrobnoe_opisanie2: string | null;
  plant_variants: AdminVariant[];
};

export type AdminVariant = {
  id: string;
  age: string;
  photo: string;
  price: string;
};

export default function AdminPlants() {
  const [plants, setPlants] = useState<AdminPlant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlants = async () => {
    const res = await fetch("/api/admin/plants");
    const data = await res.json();
    setPlants(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const addPlant = async () => {
    const slug = prompt("slug (уникальный)");
    const title = prompt("Название");

    if (!slug || !title) return;

    await fetch("/api/admin/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title }),
    });

    loadPlants();
  };

  if (loading) return <p>Загрузка…</p>;

  return (
    <>
      <button onClick={addPlant}>➕ Добавить растение</button>

      {plants.map((plant) => (
        <PlantEditor
          key={plant.id}
          plant={plant}
          onChange={loadPlants}
        />
      ))}
    </>
  );
}
