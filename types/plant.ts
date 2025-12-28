export type PlantVariant = {
  age: string;
  photo: string;
  price: string;
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