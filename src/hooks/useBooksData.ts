import { useQuery } from 'react-query';
import { Book } from '../components/Books.type';
import { getBooks } from '../services/fakeBookService';

export const useBooksData = () => {
  const { data: books = [] } = useQuery('books', getBooks);

  const getBookById = (bookId: string): Book | undefined => {
    return books.find((book) => book.id === bookId);
  };

  return { books, getBookById };
};