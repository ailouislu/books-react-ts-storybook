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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useBooksData } from "../hooks/useBooksData";
import { useGenresStore } from "../hooks/UseGenresData";
import BookList from "./BookList";
import GenreList from "./GenreList";
import SearchBar from "./SearchBar";
import { Book, Genre } from "./Books.type";

const Books: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const navigate = useNavigate();

  const { books } = useBooksData();
  const {
    genres,
    isLoading: isGenresLoading,
    error: genresError,
    fetchGenres,
  } = useGenresStore();

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const allGenres = [{ id: "", name: "All Genres" }, ...genres];

  useEffect(() => {
    if (genres.length > 0) {
      setSelectedGenre(allGenres[0]);
    }
  }, [genres]);

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenre(genre);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenre(allGenres[0]);
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const filteredBooks = books.filter((book: Book) => {
    if (
      selectedGenre &&
      selectedGenre.name !== "All Genres" &&
      book.type !== selectedGenre.name
    ) {
      return false;
    }
    if (
      searchQuery &&
      !book.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (isGenresLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (genresError) {
    return <Center>An error occurred while fetching genres.</Center>;
  }

  if (filteredBooks.length === 0) {
    return <Center>There are no books in the database.</Center>;
  }

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
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <GenreList
              genres={allGenres}
              selectedGenre={selectedGenre}
              onGenreSelect={handleGenreSelect}
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 9 }}>
            <SearchBar
              searchQuery={searchQuery}
              onSearch={handleSearch}
              bookCount={filteredBooks.length}
            />
            <BookList books={filteredBooks} onBookClick={handleBookClick} />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Books;
