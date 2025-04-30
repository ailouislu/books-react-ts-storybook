import React, { useState } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
  Grid,
  GridItem,
  useBreakpointValue,
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
    navigate("/books");
  };

  const gridTemplateColumns = useBreakpointValue({
    base: "1fr",
    md: "3fr 7fr",
  });

  const imageContainerWidth = useBreakpointValue({
    base: "80%",
    sm: "60%",
    md: "300px",
  });

  const imageContainerHeight = useBreakpointValue({
    base: "auto",
    md: "450px",
  });

  const vstackSpacing = useBreakpointValue({
    base: 3,
    md: 4,
  });

  const titleFontSize = useBreakpointValue({
    base: "xl",
    md: "xl",
  });

  const textFontSize = useBreakpointValue({
    base: "sm",
    md: "md",
  });

  const descriptionFontSize = useBreakpointValue({
    base: "sm",
    md: "md",
  });

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

  const getAuthors = () => {
    if (book.authors && book.authors.length > 0) {
      const authorNames = book.authors
        .map((author) => author.author?.name)
        .filter(Boolean);
      return authorNames.join("、");
    }
    return "";
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Breadcrumb mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">BookDetails</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      <Grid templateColumns={gridTemplateColumns} gap={6}>
        <GridItem>
          <Box
            position="relative"
            width={imageContainerWidth}
            height={imageContainerHeight}
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
            <Image
              src={imageSrc}
              alt={`Cover of ${book.title}`}
              width="100%"
              height="100%"
              objectFit="contain"
              onLoad={() => setImageLoaded(true)}
              opacity={imageLoaded ? 1 : 0}
              transition="opacity 0.3s"
            />
          </Box>
        </GridItem>
        <GridItem>
          <VStack align="start" spacing={vstackSpacing}>
            {" "}
            <Heading as="h2" size={titleFontSize}>
              {" "}
              {book.title}
            </Heading>
            <Text fontSize={textFontSize}>
              {" "}
              Author
              {getAuthors() && (
                <Text as="span" fontWeight="bold" ml={2}>
                  {getAuthors()}
                </Text>
              )}
            </Text>
            {book.first_publish_date && (
              <Text fontSize={textFontSize} color="gray.600">
                {" "}
                First published: {book.first_publish_date}
              </Text>
            )}
            {book.subjects && book.subjects.length > 0 && (
              <HStack spacing={2} wrap="wrap">
                {" "}
                {book.subjects.slice(0, 5).map((subject, index) => (
                  <Badge key={index} colorScheme="blue" variant="solid">
                    {subject.toUpperCase()}
                  </Badge>
                ))}
              </HStack>
            )}
            {book.description && (
              <Box>
                <Heading as="h3" size="md" mb={2}>
                  Description
                </Heading>
                <Text fontSize={descriptionFontSize}>
                  {" "}
                  {typeof book.description === "string"
                    ? book.description
                    : book.description.value}
                </Text>
              </Box>
            )}
          </VStack>
        </GridItem>
      </Grid>

      <Flex justifyContent="center" mt={8}>
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
          Back to Books
        </Button>
      </Flex>
    </Box>
  );
};
