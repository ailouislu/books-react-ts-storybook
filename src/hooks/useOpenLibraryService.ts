import axios from 'axios';
import { useState, useCallback } from 'react';
import {
  OpenLibrarySearchResponse,
  OpenLibraryBook,
  OpenLibraryBookDetails,
  Author,
} from '../components/Books.type';

const BASE_URL = 'https://openlibrary.org';

export const useOpenLibraryService = () => {
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [book, setBook] = useState<OpenLibraryBookDetails | null>(null);
  const [author, setAuthor] = useState<Author | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<OpenLibrarySearchResponse>(
        `${BASE_URL}/search.json`,
        {
          params: { q: query, limit: 10 },
        }
      );
      setBooks(response.data.docs);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAuthorName = async (authorKey: string): Promise<string> => {
    try {
      const response = await axios.get<Author>(`${BASE_URL}${authorKey}.json`);
      return response.data.name;
    } catch (err) {
      console.error('Error fetching author details:', err);
      return 'Unknown Author';
    }
  };

  const getBookDetails = useCallback(async (bookKey: string) => {
    setIsLoading(true);
    setError(null);
    setBook(null);

    try {
      const cleanBookKey = bookKey.replace('/works/', '');
      
      const response = await axios.get<OpenLibraryBookDetails>(
        `${BASE_URL}/works/${cleanBookKey}.json`
      );
      const bookData = response.data;

      if (bookData.authors) {
        const authorPromises = bookData.authors.map((author) =>
          getAuthorName(author.author.key)
        );
        const authorNames = await Promise.all(authorPromises);
        bookData.authors = authorNames.map((name) => ({
          author: { key: '', name },
        }));
      }

      setBook(bookData);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Failed to fetch book details: ${err.message}`);
        console.error('Error details:', err.response?.data);
      } else {
        setError('An unknown error occurred while fetching book details.');
        console.error('Unexpected error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAuthorDetails = useCallback(async (authorId: string) => {
    setIsLoading(true);
    setError(null);
    setAuthor(null);
   
    try {
      const response = await axios.get<Author>(`${BASE_URL}/authors/${authorId}.json`);
      setAuthor(response.data);
    } catch (err) {
      setError('Failed to fetch author details. Please try again.');
      console.error('Error fetching author details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
   
  return { books, book, author, isLoading, error, searchBooks, getBookDetails, getAuthorDetails };
};