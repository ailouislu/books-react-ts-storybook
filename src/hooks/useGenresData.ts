import { create } from "zustand";
import { Genre } from "../components/Books.type";
import { genreNames } from "../services/genreService";

interface GenresStore {
  genres: Genre[];
  isLoading: boolean;
  error: Error | null;
  fetchGenres: () => Promise<void>;
  hasLoaded: boolean;
}

export const useGenresStore = create<GenresStore>((set, get) => ({
  genres: genreNames,
  isLoading: false,
  error: null,
  hasLoaded: true,
  fetchGenres: async () => {},
}));
