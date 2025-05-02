import { useState, useEffect, useRef } from 'react';
import { Author } from '../components/Books.type';
import { getAuthorsBySubject } from '../services/authorService';

export const useAuthorsData = (subject: string) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const limit = 9;
  const hasMore = authors.length < total;

  useEffect(() => {
    cancelRef.current = false;
    setAuthors([]);
    setPage(1);
    setTotal(0);
    setError(null);

    const load = async () => {
      setIsLoading(true);
      try {
        const { authors: a, total: t } = await getAuthorsBySubject(subject, limit, 1);
        if (!cancelRef.current) {
          setAuthors(a);
          setTotal(t);
        }
      } catch {
        if (!cancelRef.current) setError('Failed to fetch authors.');
      } finally {
        if (!cancelRef.current) setIsLoading(false);
      }
    };

    load();
    return () => { cancelRef.current = true; };
  }, [subject]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const next = page + 1;
      const { authors: a, total: t } = await getAuthorsBySubject(subject, limit, next);
      if (!cancelRef.current) {
        setAuthors(prev => {
          const map = new Map(prev.map(x => [x.key, x.name]));
          a.forEach(x => { if (!map.has(x.key)) map.set(x.key, x.name); });
          return Array.from(map.entries()).map(([key, name]) => ({ key, name, photos: [], birth_date: '', bio: '' }));
        });
        setTotal(t);
        setPage(next);
      }
    } catch {
      if (!cancelRef.current) setError('Failed to fetch more authors.');
    } finally {
      if (!cancelRef.current) setIsLoading(false);
    }
  };

  return { authors, total, isLoading, error, hasMore, loadMore };
};
