import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getStoredFavorites } from '../utils/localStorage';

interface FavoritesState {
  ids: number[];
}

const initialState: FavoritesState = {
  ids: getStoredFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const exists = state.ids.includes(action.payload);
      state.ids = exists ? state.ids.filter((id) => id !== action.payload) : [...state.ids, action.payload];
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    clearFavorites: (state) => {
      state.ids = [];
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;