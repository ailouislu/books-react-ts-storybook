import React from "react";
import { Box, Input, Text } from "@chakra-ui/react";

export interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  bookCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearch,
  bookCount,
}) => {
  return (
    <Box mb={4}>
      <Text>Showing {bookCount} books in the database.</Text>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearch(e.currentTarget.value)}
        my={3}
      />
    </Box>
  );
};

export default SearchBar;
