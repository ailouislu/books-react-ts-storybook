import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Center,
  Image,
  Heading,
  HStack,
  Table,
  Tbody,
  Tr,
  Td,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
} from "@chakra-ui/react";
import { getBooks } from "../services/fakeBookService";

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

const BookDetails: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const books = getBooks();
    if (books.length > 0) {
      setBook(books[0]);
    }
  }, []);

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
    if (book) {
      loadImage(book.isbn);
    }
  }, [book]);

  const handleBackToBooks = () => {
    navigate("/books");
  };

  if (!book) {
    return <Center>Loading...</Center>;
  }

  return (
    <Box p={5}>
      <Breadcrumb mb={4}>
        <BreadcrumbItem>
          <Button colorScheme="blue" onClick={handleBackToBooks}>
            Books
          </Button>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Box>{book.title}</Box>
        </BreadcrumbItem>
      </Breadcrumb>

      <HStack spacing={10} align="flex-start">
        <Box>
          <Image src={imageSrc} alt={`${book.title} cover`} borderRadius="lg" />
          <br></br>
          <Button mt={4} colorScheme="blue" onClick={handleBackToBooks}>
            Back
          </Button>
        </Box>

        <Box flex="1">
          <Heading>{book.title}</Heading>
          <Heading size="md" mt={2}>
            {book.subtitle}
          </Heading>
          <Divider my={4} />
          <HStack justify="space-between" w="100%">
            <Text>
              By{" "}
              <Box as="span" color="green.500">
                {book.author}
              </Box>
            </Text>
            <Box color="red.500">Best Seller</Box>
          </HStack>
          <Divider my={4} />
          <HStack justify="space-between" w="100%">
            <Badge colorScheme="blue">{book.type}</Badge>
            <Box>{book.format}</Box>
          </HStack>
          <Divider my={4} />
          <Box>Publisher RRP ${book.publisherRRP}</Box>
          <Box color="red.500" fontSize="2xl" fontWeight="bold">
            Our price ${book.price}
          </Box>
          <Accordion allowToggle mt={4}>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Description
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>{book.description}</AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Table variant="striped" mt={4}>
            <Tbody>
              <Tr>
                <Td fontWeight="bold">ISBN</Td>
                <Td>{book.isbn}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">No. Of Pages</Td>
                <Td>{book.pages}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Dimensions</Td>
                <Td>{book.dimensions}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">On Sale Date</Td>
                <Td>{book.releaseDate}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Publisher</Td>
                <Td>{book.publisher}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </HStack>
    </Box>
  );
};

export default BookDetails;
