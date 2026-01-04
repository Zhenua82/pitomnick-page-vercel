import { useState } from "react";
import VariantEditor from "./VariantEditor";
import type { AdminPlant } from "./AdminPlants";

type Props = {
  plant: AdminPlant;
  onChange: () => void;
};

export default function PlantEditor({ plant, onChange }: Props) {
  const [form, setForm] = useState({ ...plant });

  const save = async () => {
    await fetch(`/api/admin/plants/${plant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onChange();
  };

  const remove = async () => {
    if (!confirm("Удалить растение полностью?")) return;

    await fetch(`/api/admin/plants/${plant.id}`, {
      method: "DELETE",
    });

    onChange();
  };

  return (
    <div style={{ border: "1px solid #ccc", marginTop: 16, padding: 16 }}>
      <input style={{ width: '20%' }}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Название"
      />

      <input
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
        placeholder="slug"
      />

      <textarea style={{ width: '20%', height: '200px' }}
        value={form.opisanie ?? ""}
        onChange={(e) => setForm({ ...form, opisanie: e.target.value })}
        placeholder="Описание"
      />

      <textarea style={{ width: '20%', height: '200px' }}
        value={form.podrobnoe_opisanie1 ?? ""}
        onChange={(e) =>
          setForm({ ...form, podrobnoe_opisanie1: e.target.value })
        }
        placeholder="Подробное описание 1"
      />

      <textarea style={{ width: '20%', height: '200px'}}
        value={form.podrobnoe_opisanie2 ?? ""}
        onChange={(e) =>
          setForm({ ...form, podrobnoe_opisanie2: e.target.value })
        }
        placeholder="Подробное описание 2"
      />

      <div style={{ marginTop: 8 }}>
        <button onClick={save}>💾 Сохранить</button>
        <button onClick={remove} style={{ marginLeft: 8 }}>
          🗑 Удалить
        </button>
      </div>

      <h4>Варианты</h4>
      {plant.plant_variants.map((v) => (
        <VariantEditor
          key={v.id}
          variant={v}
          plantId={plant.id}
          onChange={onChange}
        />
      ))}

      <button
        onClick={async () => {
          const age = prompt("Возраст");
          const photo = prompt("Фото (URL)");
          const price = prompt("Цена");

          if (!age || !price) return;

          await fetch("/api/admin/plant-variants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              plant_id: plant.id,
              age,
              photo,
              price,
            }),
          });

          onChange();
        }}
      >
        ➕ Добавить вариант
      </button>
    </div>
  );
}
