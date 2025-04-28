import React from "react";
import { Box, Grid } from "@chakra-ui/react";
import { Book } from "../Books.type";
import { BookCard } from "../BookCard";

interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
      {books.map((book) => (
        <Box key={book.id} onClick={() => onBookClick(book.id)}>
          <BookCard bookId={book.id} />
        </Box>
      ))}
    </Grid>
  );
};

export default BookList;
