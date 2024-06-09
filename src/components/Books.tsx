import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Center,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { getBooks } from "../services/fakeBookService";
import { getGenres } from "../services/fakeGenreService";

interface Book {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  format: string;
  releaseDate: string;
  author: string;
  price: number;
  publisherRRP: number;
  pages: number;
  description: string;
  dimensions: string;
  wishList: boolean;
  isbn: string;
  publisher: string;
}

interface Genre {
  id: string;
  name: string;
}

const Books: React.FC = () => {
  const [data, setData] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [types, setTypes] = useState<Genre[]>([]);
  const [type, setType] = useState<Genre | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const result = getBooks();
    setData(result);
    setAllBooks(result);
    const typesResult = getGenres();
    const genres = [{ id: "", name: "All Genres" }, ...typesResult];
    setTypes(genres);
  }, []);

  const handleGenreSelect = (genre: Genre) => {
    setType(genre);
    let filtered = allBooks;
    if (genre.name !== "All Genres")
      filtered = filtered.filter((m) => m.type === genre.name);
    setData(filtered);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    let filtered = allBooks;
    if (query)
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().startsWith(query.toLowerCase())
      );
    setData(filtered);
    setSearchQuery(query);
    setType(null);
  };

  const count = data.length;
  if (count === 0) return <Center>There are no books in the database.</Center>;

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
              {types.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleGenreSelect(item)}
                  cursor="pointer"
                  p={2}
                  bg={item === type ? "blue.500" : "white"}
                  color={item === type ? "white" : "black"}
                  borderRadius="md"
                >
                  {item.name}
                </ListItem>
              ))}
            </List>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 9 }}>
            <Box mb={4}>
              <Text>Showing {count} books in the database.</Text>
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
              {data.map((item) => (
                <BookCard key={item.id} book={item} />
              ))}
            </Grid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    const loadImage = async (isbn: string | undefined) => {
      try {
        const image = isbn
          ? (await import(`../images/${isbn}.jpg`)).default
          : (await import(`../images/default.jpg`)).default;
        setImageSrc(image);
      } catch {
        setImageSrc((await import(`../images/default.jpg`)).default);
      }
    };
    loadImage(book.isbn);
  }, [book]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      as={Link}
      to={`/books/${book.id}`}
    >
      <Image src={imageSrc} alt={book.title} mb={3} />
      <Box>
        <Heading size="md">{book.title}</Heading>
        <Text>{book.subtitle}</Text>
        <Divider my={2} />
        <Text>Author: {book.author}</Text>
        <Text>Price: ${book.price}</Text>
      </Box>
    </Box>
  );
};

export default Books;
