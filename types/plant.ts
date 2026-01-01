// types/plants.ts
export type PlantVariant = {
  age: string;
  photo: string;
  // price: string;
  price: number;
};

export type Plant = {
  id: string;
  slug: string;
  title: string;
  opisanie: string | null;
  podrobnoe_opisanie1: string | null;
  podrobnoe_opisanie2: string | null;
  plant_variants: PlantVariant[];
};




export type AgeKey = string;

export type PlantObsh = {
  slug: string;
  title: string;
  photo: Record<AgeKey, string>;
  opisanie: string;
  podrobnoeOpisanie1: string;
  podrobnoeOpisanie2: string;
  cena: Record<AgeKey, string>;
};

export type PlantsMap = Record<string, PlantObsh>;
