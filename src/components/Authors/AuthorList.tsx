import React from "react";
import {
  Box,
  SimpleGrid,
  Center,
  Spinner,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { useInView } from "react-intersection-observer";
import { Author } from "../Books.type";

interface Props {
  authors: Author[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore?: () => void;
  onAuthorClick: (authorKey: string) => void;
}

const AuthorList: React.FC<Props> = ({
  authors,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onAuthorClick,
}) => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: false });

  React.useEffect(() => {
    if (inView && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {authors.map((a) => (
          <Box
            key={a.key}
            textAlign="center"
            p={4}
            boxShadow="sm"
            borderRadius="md"
            cursor="pointer"
            onClick={() => onAuthorClick(a.key)}
          >
            <Avatar name={a.name} size="lg" mb={2} src={a.photos[0]} />
            <Text fontWeight="bold">{a.name}</Text>
          </Box>
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
