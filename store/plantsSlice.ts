// store/plantsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPlants } from "@/lib/fetchPlants";
import { PlantsMap } from "@/types/plant";

type PlantsState = {
  data: PlantsMap;
  loaded: boolean;
};

const initialState: PlantsState = {
  data: {},
  loaded: false,
};

export const loadPlants = createAsyncThunk(
  "plants/load",
  async () => {
    return await fetchPlants();
  }
);

const saveToLS = (plants: PlantsMap) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("plants", JSON.stringify(plants));
  }
};

const loadFromLS = (): PlantsMap | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("plants");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const plantsSlice = createSlice({
  name: "plants",
  initialState,
  reducers: {
    restorePlantsFromLS(state) {
      const cached = loadFromLS();
      if (cached) {
        state.data = cached;
        state.loaded = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadPlants.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loaded = true;
      saveToLS(action.payload);
    });
  },
});

export const { restorePlantsFromLS } = plantsSlice.actions;
export default plantsSlice.reducer;
