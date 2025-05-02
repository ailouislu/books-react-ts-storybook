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
  useBreakpointValue,
} from "@chakra-ui/react";
import { useOpenLibraryService } from "../../hooks/useOpenLibraryService";
import defaultImage from "../../images/default.jpg";
import { ChevronLeftIcon } from "@chakra-ui/icons";

export const AuthorDetails: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { author, isLoading, error, getAuthorDetails } =
    useOpenLibraryService();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(defaultImage);
  const navigate = useNavigate();

  useEffect(() => {
    if (authorId) getAuthorDetails(authorId);
  }, [authorId, getAuthorDetails]);

  useEffect(() => {
    if (author) {
      setImageLoaded(false);
      if (Array.isArray(author.photos) && author.photos.length > 0) {
        setImageSrc(
          `https://covers.openlibrary.org/b/id/${author.photos[0]}-L.jpg`
        );
      } else {
        setImageSrc(defaultImage);
      }
    }
  }, [author]);

  const gridTemplate = useBreakpointValue({ base: "1fr", md: "3fr 7fr" });
  const imageWidth = useBreakpointValue({
    base: "80%",
    sm: "60%",
    md: "250px",
  });
  const imageHeight = useBreakpointValue({ base: "auto", md: "400px" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });
  const containerMaxW = useBreakpointValue({ base: "100%", md: "1250px" });

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

  if (!author) return <Text>No author details available.</Text>;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      maxW={containerMaxW}
      mx="auto"
    >
      <Breadcrumb mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/authors">Authors</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">AuthorDetails</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Grid templateColumns={gridTemplate} gap={6}>
        <GridItem>
          <Box position="relative" w={imageWidth} h={imageHeight} mx="auto">
            {!imageLoaded && (
              <Center position="absolute" top="0" left="0" w="100%" h="100%">
                <Spinner />
              </Center>
            )}
            <Image
              src={imageSrc}
              alt={`Photo of ${author.name}`}
              w="100%"
              h="100%"
              objectFit="contain"
              onLoad={() => setImageLoaded(true)}
              opacity={imageLoaded ? 1 : 0}
              transition="opacity 0.3s"
            />
          </Box>
        </GridItem>
        <GridItem>
          <Box>
            <Heading as="h2" size={headingSize}>
              {author.name}
            </Heading>
            <Text mt={2} fontSize={textSize}>
              Birth Date: {author.birth_date}
            </Text>
            <Text mt={2} fontSize={textSize}>
              Bio:{" "}
              {typeof author.bio === "string"
                ? author.bio
                : author.bio && "value" in author.bio
                  ? author.bio.value
                  : ""}
            </Text>
          </Box>
        </GridItem>
      </Grid>
      <Center mt={8}>
        <Button
          leftIcon={<ChevronLeftIcon />}
          onClick={() => navigate(-1)}
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          boxShadow="md"
          px={10}
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          transition="all 0.2s"
        >
          Back to Authors
        </Button>
      </Center>
    </Box>
  );
};
