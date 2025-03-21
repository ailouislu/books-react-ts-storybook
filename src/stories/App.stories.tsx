import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "../App";
import Books from "../components/Books/Books";
import { useBooksData } from "../hooks/useBooksData";
import { useGenresStore } from "../hooks/useGenresData";
import { Genre } from "../components/Books.type";
import React, { useEffect } from "react";

const queryClient = new QueryClient();

export default {
  title: "Components/App",
  component: App,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <Routes>
              <Route path="/" element={<Story />} />
              <Route path="/books" element={<BooksWrapper />} />
            </Routes>
          </ChakraProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn = (args) => <App {...args} />;

export const Default = Template.bind({});
Default.args = {};

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
