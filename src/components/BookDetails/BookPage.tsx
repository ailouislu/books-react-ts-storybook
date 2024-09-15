import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Text, Box } from "@chakra-ui/react";
import { BookDetails } from "./BookDetails";
import { useOpenLibraryService } from "../../hooks/useOpenLibraryService";

export const BookPage: React.FC = () => {
  const { bookKey } = useParams<{ bookKey: string }>();
  const { book, isLoading, error, getBookDetails } = useOpenLibraryService();
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    if (bookKey) {
      getBookDetails(bookKey);
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
    loadImage();
  }, [book]);

  if (!bookKey) {
    return <Text>No book key provided</Text>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Box>
        <Text color="red.500">{error}</Text>
        <Text>Book Key: {bookKey}</Text>
      </Box>
    );
  }

  if (!book) {
    return <Text>No book details available.</Text>;
  }

  return (
    <BookDetails
      book={book}
      imageSrc={imageSrc}
      isLoading={isLoading}
      error={error}
    />
  );
};
