import React, { useEffect } from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useOpenLibraryService } from "../hooks/useOpenLibraryService";

interface BookDetailsProps {
  bookKey: string;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ bookKey }) => {
  const { book, isLoading, error, getBookDetails } = useOpenLibraryService();

  useEffect(() => {
    getBookDetails(bookKey);
  }, [bookKey, getBookDetails]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!book) {
    return <Text>No book details available.</Text>;
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <HStack spacing={4} align="start">
        <Image
          src={
            book.covers
              ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
              : "/placeholder-book.png"
          }
          alt={`Cover of ${book.title}`}
          maxW="150px"
          objectFit="cover"
        />
        <VStack align="start" spacing={2}>
          <Heading as="h2" size="lg">
            {book.title}
          </Heading>
          <Text fontSize="md">
            by{" "}
            {book.authors
              ? book.authors.map((author) => author.name).join(", ")
              : "Unknown Author"}
          </Text>
          {book.first_publish_date && (
            <Text fontSize="sm" color="gray.600">
              First published: {book.first_publish_date}
            </Text>
          )}
          {book.subjects && (
            <HStack>
              {book.subjects.slice(0, 3).map((subject, index) => (
                <Badge key={index} colorScheme="blue">
                  {subject}
                </Badge>
              ))}
            </HStack>
          )}
          {book.number_of_pages && (
            <Text fontSize="sm">Pages: {book.number_of_pages}</Text>
          )}
          {book.description && (
            <Text noOfLines={3} fontSize="sm">
              {typeof book.description === "string"
                ? book.description
                : book.description.value}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};
