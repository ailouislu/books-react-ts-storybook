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
  useBreakpointValue,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useBooksData } from "../../hooks/useBooksData";
import { useGenresStore } from "../../hooks/useGenresData";
import BookList from "./BookList";
import GenreList from "../GenreList";
import SearchBar from "../SearchBar";
import { Genre } from "../Books.type";

const Books = () => {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
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

  const handleSearch = (query: string) => setLocalSearchQuery(query);

  const gridCols = useBreakpointValue({
    base: "repeat(1,1fr)",
    md: "repeat(12,1fr)",
  });
  const genreSpan = useBreakpointValue({ base: 12, md: 3 });
  const bookSpan = useBreakpointValue({ base: 12, md: 9 });

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
        <Grid templateColumns={gridCols} gap={6}>
          <GridItem colSpan={genreSpan}>
            <GenreList
              genres={genres}
              selectedGenre={localSelectedGenre}
              onGenreSelect={handleGenreSelect}
            />
          </GridItem>
          <GridItem colSpan={bookSpan}>
            <BookListContainer
              selectedGenre={localSelectedGenre}
              searchQuery={localSearchQuery}
              onBookClick={(id) => navigate(`/books/${id}`)}
              onSearch={handleSearch}
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
  onSearch: (query: string) => void;
}

const BookListContainer: React.FC<BookListContainerProps> = ({
  selectedGenre,
  searchQuery,
  onBookClick,
  onSearch,
}) => {
  const { books, total, isLoading, error, hasMore, loadMore } = useBooksData(
    selectedGenre.id
  );

  const filtered = books.filter(
    (b) =>
      !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && books.length === 0) {
    return (
      <>
        <SearchBar
          searchQuery={searchQuery}
          onSearch={onSearch}
          bookCount={0}
        />
        <Center>
          <Grid
            templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap={6}
            width="100%"
          >
            {[...Array(6)].map((_, index) => (
              <Box
                key={index}
                padding="6"
                boxShadow="lg"
                bg="white"
                borderRadius="lg"
              >
                <Skeleton height="400px" mb="3" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
                <SkeletonText mt="4" noOfLines={1} spacing="4" width="70%" />
              </Box>
            ))}
          </Grid>
        </Center>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SearchBar
          searchQuery={searchQuery}
          onSearch={onSearch}
          bookCount={0}
        />
        <Center>An error occurred.</Center>
      </>
    );
  }

  if (filtered.length === 0) {
    return (
      <>
        <SearchBar
          searchQuery={searchQuery}
          onSearch={onSearch}
          bookCount={0}
        />
        <Center>No books match.</Center>
      </>
    );
  }

  return (
    <>
      <Box mb={4}>
        Showing <strong>{filtered.length}</strong> of <strong>{total}</strong>{" "}
        books
      </Box>
      <SearchBar
        searchQuery={searchQuery}
        onSearch={onSearch}
        bookCount={filtered.length}
      />
      <BookList
        books={filtered}
        onBookClick={onBookClick}
        hasMore={hasMore}
        isLoadingMore={isLoading}
        onLoadMore={loadMore}
      />
    </>
  );
};

export default Books;
