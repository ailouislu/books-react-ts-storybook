import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Books from "../components/Books";
import { getBooks } from "../services/fakeBookService";
import { getGenres } from "../services/fakeGenreService";

const queryClient = new QueryClient();

export default {
  title: "Components/Books",
  component: Books,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <Story />
          </ChakraProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn = (args) => <Books {...args} />;

export const Default = Template.bind({});
Default.args = {
  books: getBooks(),
  genres: getGenres(),
};
