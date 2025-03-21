import React, { useEffect } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useBooksData } from "../hooks/useBooksData";
import { useGenresStore } from "../hooks/useGenresData";
import { Genre } from "../components/Books.type";
import Books from "../components/Books/Books";

const queryClient = new QueryClient();

const MemoryRouterDecorator = (initialEntries: string[]) => (Story: React.FC) =>
  (
    <MemoryRouter initialEntries={initialEntries}>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route
              path="*"
              element={
                <Box width="1200px">
                  <Story />
                </Box>
              }
            />
          </Routes>
        </QueryClientProvider>
      </ChakraProvider>
    </MemoryRouter>
  );

export default {
  title: "Components/Books",
  component: Books,
  decorators: [MemoryRouterDecorator(["/books"])],
} as Meta;

const BooksWrapper: React.FC = () => {
  const { genres, fetchGenres } = useGenresStore();
  const { books, isLoading, error } = useBooksData("fiction");

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleGenreSelect = (genre: Genre) => {
    console.log("Selected genre:", genre);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleBookClick = (bookId: string) => {
    console.log("Book clicked:", bookId);
  };

  return (
    <Books
      books={books as any}
      isLoading={isLoading}
      error={error}
      searchBooks={handleSearch}
      handleGenreSelect={handleGenreSelect}
      handleSearch={handleSearch}
      handleBookClick={handleBookClick}
      selectedGenre={genres[0] || null}
      searchQuery=""
    />
  );
};

const Template: StoryFn = (args: any) => <BooksWrapper {...args} />;

export const Default = Template.bind({});
Default.args = {};
