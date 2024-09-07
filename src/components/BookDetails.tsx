import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Heading,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useOpenLibraryService } from "../hooks/useOpenLibraryService";

interface BookDetailsProps {
  bookKey: string;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ bookKey }) => {
  const { book, isLoading, error, getBookDetails } = useOpenLibraryService();
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    getBookDetails(bookKey);
  }, [bookKey, getBookDetails]);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = book?.covers?.[0]
          ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
          : (await import(`../images/default.jpg`)).default;
        setImageSrc(image);
      } catch {
        setImageSrc((await import(`../images/default.jpg`)).default);
      }
    };
    loadImage();
  }, [book]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!book) {
    return <Text>No book details available.</Text>;
  }

  const getAuthors = () => {
    if (book.authors && book.authors.length > 0) {
      return book.authors.map((author) => author.author.name).join("、");
    }
    return "";
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <HStack spacing={4} align="start">
        <Box width="150px" height="200px" position="relative">
          {!imageLoaded && (
            <Center
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
            >
              <Spinner />
            </Center>
          )}
          <Image
            src={imageSrc}
            alt={`Cover of ${book?.title}`}
            maxW="150px"
            objectFit="cover"
            onLoad={() => setImageLoaded(true)}
            opacity={imageLoaded ? 1 : 0}
            transition="opacity 0.3s"
          />
        </Box>
        <VStack align="start" spacing={2}>
          <Heading as="h2" size="lg">
            {book.title}
          </Heading>
          <Text fontSize="md">
            by
            {getAuthors() && (
              <Text as="span" fontWeight="bold" ml={1}>
                {getAuthors()}
              </Text>
            )}
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
                  {subject.toUpperCase()}
                </Badge>
              ))}
            </HStack>
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
