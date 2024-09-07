import { useState, useCallback } from "react";
import axios from "axios";
import {
  OpenLibrarySearchResponse,
  OpenLibraryBook,
  OpenLibraryBookDetails,
  OpenLibraryAuthor,
} from "../components/Books.type";

const BASE_URL = "https://openlibrary.org";

export const useOpenLibraryService = () => {
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [book, setBook] = useState<OpenLibraryBookDetails | null>(null);
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
      setError("Failed to fetch books. Please try again.");
      console.error("Error fetching books:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAuthorName = async (authorKey: string): Promise<string> => {
    try {
      const response = await axios.get<OpenLibraryAuthor>(
        `${BASE_URL}${authorKey}.json`
      );
      return response.data.name;
    } catch (err) {
      console.error("Error fetching author details:", err);
      return "Unknown Author";
    }
  };

  const getBookDetails = useCallback(async (bookKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<OpenLibraryBookDetails>(
        `${BASE_URL}${bookKey}.json`
      );
      const bookData = response.data;

      if (bookData.authors) {
        const authorPromises = bookData.authors.map((author) =>
          getAuthorName(author.author.key)
        );
        const authorNames = await Promise.all(authorPromises);
        bookData.authors = authorNames.map((name) => ({
          author: { key: "", name },
        }));
      }

      setBook(bookData);
    } catch (err) {
      setError("Failed to fetch book details. Please try again.");
      console.error("Error fetching book details:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { books, book, isLoading, error, searchBooks, getBookDetails };
};
