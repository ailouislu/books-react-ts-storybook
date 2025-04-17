import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  VStack,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { useOpenLibraryService } from "../../hooks/useOpenLibraryService";

export const AuthorDetails: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { author, isLoading, error, getAuthorDetails } =
    useOpenLibraryService();

  useEffect(() => {
    if (authorId) {
      getAuthorDetails(authorId);
    }
  }, [authorId, getAuthorDetails]);

  if (isLoading) {
    return <Spinner data-testid="spinner" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!author) {
    return <Text>No author details available.</Text>;
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <VStack align="start" spacing={4}>
        <Heading as="h2" size="lg">
          {author.name}
        </Heading>
        {Array.isArray(author.photos) && author.photos.length > 0 && (
          <Image
            src={`https://covers.openlibrary.org/b/id/${author.photos[0]}-L.jpg`}
            alt={`Photo of ${author.name}`}
            maxW="150px"
            objectFit="cover"
          />
        )}
        <Text>Birth Date: {author.birth_date}</Text>
        <Text>
          Bio: {typeof author.bio === "string" ? author.bio : author.bio.value}
        </Text>
      </VStack>
    </Box>
  );
};
