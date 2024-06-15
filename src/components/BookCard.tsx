import React, { useEffect, useState } from "react";
import { Box, Divider, Heading, Image, Text, VStack, Spacer } from "@chakra-ui/react";
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
    >
      <Image src={imageSrc} alt={book.title} mb={3} />
      <Box flex="1" display="flex" flexDirection="column">
        <Heading size="md" mb={2}>{book.title}</Heading>
        <Text mb={2}>{book.subtitle}</Text>
        <Divider my={2} />
        <Spacer />
        <Box mt="auto">
          <Text>Author: {book.author}</Text>
          <Text>Price: ${book.price}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default BookCard;
