import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Heading,
  Image,
  Text,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Book } from "./Books.type";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    const loadImage = async (isbn: string) => {
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
  }, [book.isbn]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      as={Link}
      to={`/books/${book.id}`}
      display="flex"
      flexDirection="column"
      position="relative"
      height="100%"
    >
      {book.bestSeller && (
        <Badge
          position="absolute"
          top="0"
          right="0"
          bg="red.500"
          color="white"
          borderRadius="full"
          px={2}
          py={1}
          zIndex="2"
        >
          Best Seller
        </Badge>
      )}
      <Box position="relative">
        <Image src={imageSrc} alt={book.title} mb={3} />
        <Box
          className="description-overlay"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.7)"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          opacity="0"
          transition="opacity 0.3s ease-in-out"
          _hover={{ opacity: 1 }}
          p={2}
          textAlign="center"
          zIndex="1"
        >
          {book.description.slice(0, 200)}...
        </Box>
      </Box>
      <Box flex="1" display="flex" flexDirection="column">
        <Heading size="md" mb={2}>
          {book.title}
        </Heading>
        <Text mb={2}>{book.subtitle}</Text>
        <Divider my={2} />
        <Spacer />
        <Box mt="auto">
          <Text>Author: {book.author}</Text>
          <Text color="red.500" fontSize="lg" fontWeight="bold">
            Price: ${book.price}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default BookCard;
