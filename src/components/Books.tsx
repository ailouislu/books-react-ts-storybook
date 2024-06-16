import React, { useState, useEffect } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Center,
  Container,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useBooksData } from "../hooks/useBooksData";
import BookList from "./BookList";
import GenreList from "./GenreList";
import SearchBar from "./SearchBar";
import { Book, Genre } from "./Books.type";

const Books: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const navigate = useNavigate();

  const { books, genresData } = useBooksData();

  const genres = [{ id: "", name: "All Genres" }, ...genresData];

  useEffect(() => {
    setSelectedGenre(genres[0]);
  }, [genresData]);

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenre(genre);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenre(genres[0]);
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

  if (filteredBooks.length === 0) {
    return <Center>There are no books in the database.</Center>;
  }

  return (
    <Box p={5}>
      <Breadcrumb mb={4}>
        <BreadcrumbItem isCurrentPage>
          <Box>Books</Box>
        </BreadcrumbItem>
      </Breadcrumb>

      <Container maxW="container.xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <GenreList
              genres={genres}
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
