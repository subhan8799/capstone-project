import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from '../store/favoritesSlice';
import searchReducer from '../store/searchSlice';
import { setStoredFavorites } from '../utils/localStorage';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    search: searchReducer,
  },
});

store.subscribe(() => {
  setStoredFavorites(store.getState().favorites.ids);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;