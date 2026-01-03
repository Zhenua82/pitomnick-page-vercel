import { useState } from "react";
import type { AdminVariant } from "./AdminPlants";

type Props = {
  variant: AdminVariant;
  plantId: string;
  onChange: () => void;
};

export default function VariantEditor({ variant, onChange }: Props) {
  const [form, setForm] = useState({ ...variant });

  const save = async () => {
    await fetch(`/api/admin/plant-variants/${variant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onChange();
  };

  const remove = async () => {
    if (!confirm("Удалить вариант?")) return;

    await fetch(`/api/admin/plant-variants/${variant.id}`, {
      method: "DELETE",
    });

    onChange();
  };

  return (
    <div style={{ paddingLeft: 16, marginBottom: 8 }}>
      <input
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
        placeholder="Возраст"
      />
      <input
        value={form.photo}
        onChange={(e) => setForm({ ...form, photo: e.target.value })}
        placeholder="Фото"
      />
      <input
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        placeholder="Цена"
      />

      <button onClick={save}>💾</button>
      <button onClick={remove}>🗑</button>
    </div>
  );
}