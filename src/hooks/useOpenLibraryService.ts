import { useState, useCallback } from 'react';
import axios from 'axios';
import { OpenLibrarySearchResponse, OpenLibraryBook, OpenLibraryBookDetails } from '../components/Books.type';

const BASE_URL = 'https://openlibrary.org';

export const useOpenLibraryService = () => {
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [book, setBook] = useState<OpenLibraryBookDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<OpenLibrarySearchResponse>(`${BASE_URL}/search.json`, {
        params: { q: query, limit: 10 }
      });
      setBooks(response.data.docs);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBookDetails = useCallback(async (bookKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<OpenLibraryBookDetails>(`${BASE_URL}${bookKey}.json`);
      setBook(response.data);
    } catch (err) {
      setError('Failed to fetch book details. Please try again.');
      console.error('Error fetching book details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { books, book, isLoading, error, searchBooks, getBookDetails };
};