import React, { useState, useEffect } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Center,
  Container,
  Grid,
  GridItem,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../services/fakeBookService";
import { getGenres } from "../services/fakeGenreService";
import BookCard from "./BookCard";
import { Book } from "./Books.type";

interface Genre {
  id: string;
  name: string;
}

const fetchBooks = async () => {
  return getBooks();
};

const fetchGenres = async () => {
  return getGenres();
};

const Books: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [type, setType] = useState<Genre | null>(null);
  const navigate = useNavigate();

  const { data: books = [] } = useQuery("books", fetchBooks);
  const { data: genresData = [] } = useQuery("genres", fetchGenres);

  const genres = [{ id: "", name: "All Genres" }, ...genresData];

  useEffect(() => {
    setType(genres[0]);
  }, [genresData]);

  const handleGenreSelect = (genre: Genre) => {
    setType(genre);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setType(genres[0]);
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const filteredBooks = books.filter((book: Book) => {
    if (type && type.name !== "All Genres" && book.type !== type.name) {
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
            <List spacing={3}>
              {genres.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleGenreSelect(item)}
                  cursor="pointer"
                  p={2}
                  bg={item.id === type?.id ? "blue.500" : "white"}
                  color={item.id === type?.id ? "white" : "black"}
                  borderRadius="md"
                >
                  {item.name}
                </ListItem>
              ))}
            </List>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 9 }}>
            <Box mb={4}>
              <Text>Showing {filteredBooks.length} books in the database.</Text>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.currentTarget.value)}
                my={3}
              />
            </Box>
            <Grid
              templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
              gap={6}
            >
              {filteredBooks.map((item: Book) => (
                <Box key={item.id} onClick={() => handleBookClick(item.id)}>
                  <BookCard book={item} />
                </Box>
              ))}
            </Grid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Books;
