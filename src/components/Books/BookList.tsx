import React from "react";
import { Box, Grid, Center, Spinner } from "@chakra-ui/react";
import { Book } from "../Books.type";
import { BookCard } from "../BookCard";
import { useInView } from "react-intersection-observer";

export interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onBookClick,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (inView && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  return (
    <>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {books.map((book) => (
          <Box
            key={book.id}
            onClick={() => onBookClick(book.id.replace("/works/", ""))}
          >
            <BookCard bookId={book.id} />
          </Box>
        ))}
      </Grid>

      {(hasMore || isLoadingMore) && onLoadMore && (
        <Center ref={ref} py={8}>
          <Spinner />
        </Center>
      )}
    </>
  );
};

export default BookList;
