import React, { useEffect } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGenresStore } from "../hooks/useGenresData";
import Books from "../components/Books/Books";

const queryClient = new QueryClient();

const MemoryRouterDecorator = (Story: React.FC) => (
  <MemoryRouter initialEntries={["/books"]}>
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
  decorators: [MemoryRouterDecorator],
} as Meta;

const BooksWrapper: React.FC = () => {
  const { fetchGenres } = useGenresStore();

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return <Books />;
};

export const Default: StoryFn = () => <BooksWrapper />;
