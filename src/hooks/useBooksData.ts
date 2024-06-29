import create from 'zustand';
import { Book, Genre } from '../components/Books.type';
import { getBooks } from '../services/fakeBookService';
import { getGenres } from '../services/fakeGenreService';

interface BooksStore {
  books: Book[];
  genres: Genre[];
  isLoading: boolean;
  error: Error | null;
  fetchBooks: () => Promise<void>;
  fetchGenres: () => Promise<void>;
  getBookById: (bookId: string) => Book | undefined;
}

export const useBooksStore = create<BooksStore>((set, get) => ({
  books: [],
  genres: [],
  isLoading: false,
  error: null,

  fetchBooks: async () => {
    set({ isLoading: true });
    try {
      const books = await getBooks();
      set({ books, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchGenres: async () => {
    set({ isLoading: true });
    try {
      const genres = await getGenres();
      set({ genres, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  getBookById: (bookId: string) => {
    return get().books.find((book) => book.id === bookId);
  },
}));