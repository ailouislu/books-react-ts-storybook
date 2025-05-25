import React from "react";
import {
  Box,
  SimpleGrid,
  Center,
  Spinner,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";
import { useInView } from "react-intersection-observer";
import { Author } from "../Books.type";
import AuthorCard from "./AuthorCard";

interface Props {
  authors: Author[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore?: () => void;
  onAuthorClick: (authorKey: string) => void;
  isInitialLoading?: boolean;
}

const AuthorCardSkeleton: React.FC = () => (
  <Box
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    p={4}
    textAlign="center"
    height="100%"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
  >
    <VStack spacing={3}>
      <SkeletonCircle size="20" />
      <Skeleton height="24px" width="80%" />
      <VStack spacing={1} width="100%">
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="90%" />
        <Skeleton height="16px" width="75%" />
      </VStack>
    </VStack>
  </Box>
);

const AuthorList: React.FC<Props> = ({
  authors,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onAuthorClick,
  isInitialLoading = false,
}) => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: false });

  React.useEffect(() => {
    if (inView && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  if (isInitialLoading) {
    return (
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {[...Array(9)].map((_, index) => (
          <AuthorCardSkeleton key={index} />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {authors.map((author) => (
          <AuthorCard
            key={author.key}
            author={author}
            onAuthorClick={onAuthorClick}
          />
        ))}
      </SimpleGrid>

      {(hasMore || isLoadingMore) && onLoadMore && (
        <Center ref={ref} py={6}>
          <Spinner />
        </Center>
      )}
    </>
  );
};

export default AuthorList;
