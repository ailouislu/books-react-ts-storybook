import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Grid,
  GridItem,
  Spinner,
  Center,
  Heading,
  Button,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useOpenLibraryService } from "../../hooks/useOpenLibraryService";

import { ChevronLeftIcon } from "@chakra-ui/icons";

export const AuthorDetails: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { author, isLoading, error, getAuthorDetails } =
    useOpenLibraryService();
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/authors");
  };

  useEffect(() => {
    if (authorId) {
      getAuthorDetails(authorId);
    }
  }, [authorId, getAuthorDetails]);

  if (isLoading) {
    return (
      <Center minH="calc(100vh - 120px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="calc(100vh - 120px)">
        <Text color="red.500" fontSize="xl">
          {error}
        </Text>
      </Center>
    );
  }

  const gridTemplateColumns = {
    base: "1fr",
    md: "3fr 7fr",
  };

  if (!author) {
    return <Text>No author details available.</Text>;
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Breadcrumb mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/authors">Authors</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">AuthorDetails</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Grid templateColumns={gridTemplateColumns} gap={6}>
        <GridItem>
          <Box
            position="relative"
            width={{ base: "80%", sm: "60%", md: "300px" }}
            height={{ base: "auto", md: "100%" }}
            mx="auto"
          >
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
            {Array.isArray(author.photos) && author.photos.length > 0 && (
              <Image
                src={`https://covers.openlibrary.org/b/id/${author.photos[0]}-L.jpg`}
                alt={`Photo of ${author.name}`}
                width="100%"
                height="100%"
                objectFit="contain"
                onLoad={() => setImageLoaded(true)}
                opacity={imageLoaded ? 1 : 0}
                transition="opacity 0.3s"
              />
            )}
          </Box>
        </GridItem>
        <GridItem>
          <Box>
            <Heading as="h2" size="xl">
              {author.name}
            </Heading>
            <Text mt={2}>Birth Date: {author.birth_date}</Text>
            <Text mt={2}>
              Bio:{" "}
              {author.bio && typeof author.bio === "string"
                ? author.bio
                : typeof author.bio === "object" &&
                    author.bio.value !== undefined
                  ? author.bio.value
                  : ""}
            </Text>
          </Box>
        </GridItem>
      </Grid>
      <Center mt={8}>
        <Button
          leftIcon={<ChevronLeftIcon />}
          onClick={handleBack}
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          boxShadow="md"
          px={10}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          transition="all 0.2s"
        >
          Back to Authors
        </Button>
      </Center>
    </Box>
  );
};
