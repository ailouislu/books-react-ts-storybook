import React, { useState } from "react";
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
  Button,
  Flex,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { OpenLibraryBookDetails } from "../Books.type";

interface BookDetailsProps {
  book: OpenLibraryBookDetails;
  imageSrc: string;
  isLoading: boolean;
  error: string | null;
}

export const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  imageSrc,
  isLoading,
  error,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  const getAuthors = () => {
    if (book.authors && book.authors.length > 0) {
      return book.authors.map((author) => author.author.name).join("、");
    }
    return "";
  };

  return (
    <VStack spacing={6} align="stretch">
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
              alt={`Cover of ${book.title}`}
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

      <Flex justifyContent="center" mt={4} mb={6}>
        <Button
          leftIcon={<ChevronLeftIcon />}
          onClick={handleBack}
          colorScheme="blue"
          size="md"
          borderRadius="full"
          boxShadow="md"
          px={8}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          transition="all 0.2s"
        >
          Back to Books
        </Button>
      </Flex>
    </VStack>
  );
};
