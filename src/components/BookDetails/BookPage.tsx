import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Text, Box, Container, Button, Flex, Skeleton, SkeletonText } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { BookDetails } from "./BookDetails";
import { useOpenLibraryService } from "../../hooks/useOpenLibraryService";

export const BookPage: React.FC = () => {
  const { bookKey } = useParams<{ bookKey: string }>();
  const { book, isLoading, error, getBookDetails } = useOpenLibraryService();
  const [imageSrc, setImageSrc] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (bookKey) {
      const cleanBookKey = bookKey.replace("/works/", "");
      getBookDetails(cleanBookKey);
    }
  }, [bookKey, getBookDetails]);

  useEffect(() => {
    const loadImage = async () => {
      if (book?.covers && book.covers.length > 0) {
        setImageSrc(
          `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
        );
      } else {
        try {
          const defaultImage = (await import(`../../images/default.jpg`))
            .default;
          setImageSrc(defaultImage);
        } catch {
          console.error("Failed to load default image");
          setImageSrc("");
        }
      }
    };

    if (book) {
      loadImage();
    }
  }, [book]);

  if (!bookKey) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>No book key provided</Text>
        <Flex justifyContent="center" mt={8}>
          <Button leftIcon={<ChevronLeftIcon />} onClick={() => navigate("/books")} colorScheme="blue" size="lg">
            Back to Books
          </Button>
        </Flex>
      </Container>);
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex direction={{ base: "column", md: "row" }} alignItems="flex-start">
          <Box w={{ base: "100%", md: "30%" }} mr={{ md: 8 }} mb={{ base: 6, md: 0 }}>
            <Skeleton height="300px" width="100%" />
          </Box>
          <Box w={{ base: "100%", md: "70%" }}>
            <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="4" width="50%" />
            <SkeletonText mt="8" noOfLines={10} spacing="4" skeletonHeight="3" />
            <SkeletonText mt="8" noOfLines={1} spacing="4" skeletonHeight="4" width="30%" />
            <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="4" width="40%" />
          </Box>
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
       <Container maxW="container.xl" py={8}>
        <Box>
          <Text color="red.500" fontSize="xl">{error}</Text>
          <Text>Book Key: {bookKey}</Text>         
        </Box>
        <Flex justifyContent="center" mt={8}>
          <Button leftIcon={<ChevronLeftIcon />} onClick={() => navigate("/books")} colorScheme="blue" size="lg">
            Back to Books
          </Button>
        </Flex>
       </Container>
    );
  }

  if (!book) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box>
          <Text>No book details available.</Text>
        </Box>
        <Flex justifyContent="center" mt={8}>
          <Button leftIcon={<ChevronLeftIcon />} onClick={() => navigate("/books")} colorScheme="blue" size="lg">
            Back to Books
          </Button>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <BookDetails
        book={book}
        imageSrc={imageSrc}
        isLoading={isLoading}
        error={error}
      />
    </Container>
  );
};
