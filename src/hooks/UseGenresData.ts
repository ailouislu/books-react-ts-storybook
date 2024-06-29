import create from 'zustand';
import { Genre } from '../components/Books.type';
import { getGenres } from '../services/fakeGenreService';

interface GenresStore {
  genres: Genre[];
  isLoading: boolean;
  error: Error | null;
  fetchGenres: () => Promise<void>;
  hasLoaded: boolean;
}

export const useGenresStore = create<GenresStore>((set, get) => ({
  genres: [],
  isLoading: false,
  error: null,
  hasLoaded: false,
  fetchGenres: async () => {
    if (get().hasLoaded) return;
    set({ isLoading: true });
    try {
      const genres = await getGenres();
      set({ genres, isLoading: false, hasLoaded: true });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
}));