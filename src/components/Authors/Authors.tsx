import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Grid,
  GridItem,
  Input,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthorsData } from "../../hooks/useAuthorsData";
import { useGenresStore } from "../../hooks/useGenresData";
import GenreList from "../GenreList";
import AuthorList from "./AuthorList";
import { Genre } from "../Books.type";

interface AuthorsProps {
  subject: string;
}

const Authors: React.FC<AuthorsProps> = ({ subject }) => {
  const navigate = useNavigate();
  const { genres, fetchGenres } = useGenresStore();
  const [localSelectedGenre, setLocalSelectedGenre] = useState<Genre>({
    id: subject,
    name: subject,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { authors, total, isLoading, error, hasMore, loadMore } =
    useAuthorsData(localSelectedGenre.id);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    setLocalSelectedGenre({ id: subject, name: subject });
  }, [subject]);

  const filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="1250px" py={5}>
      <Breadcrumb mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Authors</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Grid templateColumns={{ base: "1fr", md: "3fr 9fr" }} gap={6}>
        <GridItem>
          <GenreList
            genres={genres}
            selectedGenre={localSelectedGenre}
            onGenreSelect={(g) => {
              setLocalSelectedGenre(g);
              setSearchQuery("");
              navigate(`/authors/subject/${g.name.toLowerCase()}`);
            }}
          />
        </GridItem>
        <GridItem>
          <Input
            placeholder="Search authors..."
            mb={4}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Box mb={4}>
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{total}</strong> authors
          </Box>
          {/* Skeleton Loader */}
          {isLoading && authors.length === 0 && (
            <Center>
              <Grid
                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                gap={6}
                width="100%"
              >
                {[...Array(9)].map((_, index) => (
                  <Box
                    key={index}
                    p={4}
                    textAlign="center"
                  >
                    <SkeletonCircle size='20' mb={2} /><Skeleton height="20px" width="80%" mx="auto" /> </Box>
                ))}
              </Grid>
            </Center>
          )}
          {error && authors.length === 0 && (
            <Center color="red.500">{error}</Center>
          )}
          {filtered.length === 0 && !isLoading && (
            <Center>No authors match.</Center>
          )}
          <AuthorList
            authors={filtered}
            hasMore={hasMore}
            isLoadingMore={isLoading}
            onLoadMore={loadMore}
            onAuthorClick={(key) => navigate(`/authors/${key}`)}
          />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default Authors;
