// lib/fetchPlants.ts
import { supabaseClient  } from "./supabaseClient";
import { PlantsMap } from "@/types/plant";

export async function fetchPlants(): Promise<PlantsMap> {
  const { data, error } = await supabaseClient 
    .from("plants")
    .select(`
      slug,
      title,
      opisanie,
      podrobnoe_opisanie1,
      podrobnoe_opisanie2,
      plant_variants (
        age,
        photo,
        price
      )
    `);

  if (error) throw error;
  if (!data) return {};

  const result: PlantsMap = {};

  for (const plant of data) {
    const photo: Record<string, string> = {};
    const cena: Record<string, string> = {};

    for (const variant of plant.plant_variants ?? []) {
      photo[variant.age] = variant.photo;
      cena[variant.age] = variant.price;
    }

    result[plant.slug] = {
      slug: plant.slug,
      title: plant.title,
      opisanie: plant.opisanie ?? "",
      podrobnoeOpisanie1: plant.podrobnoe_opisanie1 ?? "",
      podrobnoeOpisanie2: plant.podrobnoe_opisanie2 ?? "",
      photo,
      cena,
    };
  }
  // console.log(result)

  return result;
}