import { useState, useEffect } from 'react';
import { Book } from '../components/Books.type';
import { getBooksByGenre } from '../services/genreService';

export const useBooksData = (genre: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const books = await getBooksByGenre(genre);
        setBooks(books);
      } catch (err) {
        setError('Failed to fetch books. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [genre]);

  return { books, isLoading, error };
};