import { useQuery } from 'react-query';
import { Book } from '../components/Books.type';
import { getBooks } from '../services/fakeBookService';
import { getGenres } from '../services/fakeGenreService';

export const useBooksData = () => {
  const { data: books = [] } = useQuery('books', getBooks);
  const { data: genresData = [] } = useQuery('genres', getGenres);
  
  const getBookById = (bookId: string): Book | undefined => {
    return books.find((book) => book.id === bookId);
  };

  return { books, genresData, getBookById };
};
