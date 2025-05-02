import { useState, useEffect, useRef } from 'react';
import { Book } from '../components/Books.type';
import { getBooksByGenre } from '../services/genreService';

export const useBooksData = (genre: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 9;
  const hasMore = books.length < total;

  const cancelRef = useRef(false);

  useEffect(() => {
    cancelRef.current = false;
    setBooks([]);
    setPage(0);
    setTotal(0);
    setError(null);

    const loadFirstPage = async () => {
      setIsLoading(true);
      try {
        const { books: newBooks, total: newTotal } = await getBooksByGenre(genre, limit, 0);
        if (cancelRef.current) return;
        setBooks(newBooks);
        setTotal(newTotal);
      } catch {
        if (!cancelRef.current) setError('Failed to fetch books. Please try again.');
      } finally {
        if (!cancelRef.current) setIsLoading(false);
      }
    };

    loadFirstPage();
    return () => { cancelRef.current = true; };
  }, [genre]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const offset = nextPage * limit;
      const { books: newBooks, total: newTotal } = await getBooksByGenre(genre, limit, offset);
      // merge unique
      setBooks(prev => {
        const unique = newBooks.filter(nb => !prev.some(pb => pb.id === nb.id));
        return [...prev, ...unique];
      });
      if (cancelRef.current) return;
      setBooks(prev => {
        const unique = newBooks.filter(nb => !prev.some(pb => pb.id === nb.id));
        return [...prev, ...unique];
      });
      setTotal(newTotal);
      setPage(nextPage);
    } catch {
      if (!cancelRef.current) setError('Failed to fetch more books. Please try again.');
    } finally {
      if (!cancelRef.current) setIsLoading(false);
    }
  };

  return { books, total, isLoading, error, hasMore, loadMore };
};
