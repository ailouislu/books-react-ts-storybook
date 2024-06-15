import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import BookDetails from "../components/BookDetails";
import { getBooks } from "../services/fakeBookService";

const queryClient = new QueryClient();

export default {
  title: "Components/BookDetails",
  component: BookDetails,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <ChakraProvider>
            <Routes>
              <Route path="/" element={<Story />} />
            </Routes>
          </ChakraProvider>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
} as Meta;

const Template: StoryFn = (args) => <BookDetails {...args} />;
const firstBook = getBooks()[0];

export const Default = Template.bind({});
Default.args = {
  book: firstBook,
};
