import React, { useEffect, useState } from "react";
import { Box, Divider, Heading, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useOpenLibraryService } from "../../hooks/useOpenLibraryService";

interface BookCardProps {
  bookId: string;
}

export const BookCard: React.FC<BookCardProps> = ({ bookId }) => {
  const { book, isLoading, error, getBookDetails } = useOpenLibraryService();
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    if (bookId) {
      const bookKey = bookId.replace("/works/", "");
      getBookDetails(bookKey);
    }
  }, [bookId, getBookDetails]);

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

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!book) {
    return <Text>No book details available.</Text>;
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      as={Link}
      to={`/books/${bookId}`}
      display="flex"
      flexDirection="column"
      height="100%"
      position="relative"
    >
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Box position="relative">
            <Image
              src={imageSrc}
              alt={book.title}
              mb={3}
              height="400px"
              width="100%"
              sx={{ objectFit: "contain" }}
            />
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
              {typeof book.description === "string"
                ? book.description.slice(0, 200)
                : book.description?.value?.slice(0, 200)}
              ...
            </Box>
          </Box>
          <Heading size="md" mb={2}>
            {book.title}
          </Heading>
        </Box>
        <Box mt={2}>
          <Divider my={2} />
          <Text>
            Author:{" "}
            {book.authors.map((author) => author.author.name).join(", ")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
