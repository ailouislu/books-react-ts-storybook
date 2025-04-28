import React, { useState, useEffect } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Container,
  Grid,
  GridItem,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useBooksData } from "../../hooks/useBooksData";
import { useGenresStore } from "../../hooks/useGenresData";
import BookList from "./BookList";
import GenreList from "../GenreList";
import SearchBar from "../SearchBar";
import { Book, Genre } from "../Books.type";

interface BooksProps {
  books?: Book[];
  isLoading?: boolean;
  error?: string | null;
  searchBooks?: (query: string) => void;
  handleGenreSelect?: (genre: Genre) => void;
  handleSearch?: (query: string) => void;
  handleBookClick?: (bookId: string) => void;
  selectedGenre?: Genre;
  searchQuery?: string;
}

const Books: React.FC<BooksProps> = () => {
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [localSelectedGenre, setLocalSelectedGenre] = useState<Genre>({
    id: "popular",
    name: "Popular",
  });
  const navigate = useNavigate();

  const { genres, fetchGenres } = useGenresStore();

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleGenreSelect = (genre: Genre) => {
    setLocalSelectedGenre(genre);
    setLocalSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
  };

  const gridTemplateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    md: "repeat(12, 1fr)",
  });

  const genreListColSpan = useBreakpointValue({
    base: 12,
    md: 3,
  });

  const bookListColSpan = useBreakpointValue({
    base: 12,
    md: 9,
  });

  return (
    <Box p={5}>
      <Container maxW="container.xl" px={0}>
        <Breadcrumb mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Books</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Grid templateColumns={gridTemplateColumns} gap={6}>
          <GridItem colSpan={genreListColSpan}>
            <GenreList
              genres={genres}
              selectedGenre={localSelectedGenre}
              onGenreSelect={handleGenreSelect}
            />
          </GridItem>
          <GridItem colSpan={bookListColSpan}>
            <SearchBar
              searchQuery={localSearchQuery}
              onSearch={handleSearch}
              bookCount={0}
            />
            <BookListContainer
              selectedGenre={localSelectedGenre}
              searchQuery={localSearchQuery}
              onBookClick={(bookId: string) => navigate(`/books/${bookId}`)}
            />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

interface BookListContainerProps {
  selectedGenre: Genre;
  searchQuery: string;
  onBookClick: (bookId: string) => void;
}

const BookListContainer: React.FC<BookListContainerProps> = ({
  selectedGenre,
  searchQuery,
  onBookClick,
}) => {
  const { books, isLoading, error } = useBooksData(selectedGenre.id);

  const filteredBooks = books.filter((book: Book) => {
    if (
      searchQuery &&
      !book.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return <Center>An error occurred while fetching data.</Center>;
  }

  if (filteredBooks.length === 0) {
    return <Center>There are no books in the database.</Center>;
  }

  return <BookList books={filteredBooks} onBookClick={onBookClick} />;
};

export default Books;
