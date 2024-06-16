import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import BookDetails from "../components/BookDetails";
import { QueryClient, QueryClientProvider } from "react-query";
import { getBooks } from "../services/fakeBookService";

const queryClient = new QueryClient();

const books = getBooks();
const firstBook = books.length > 0 ? books[0] : null;

const BookDetailsWithProvider = () => {
  return <BookDetails />;
};

export default {
  title: "Components/BookDetails",
  component: BookDetailsWithProvider,
  decorators: [
    (Story) => (
      <MemoryRouter
        initialEntries={[`/books/${firstBook ? firstBook.id : "1"}`]}
      >
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/books/:bookId" element={<Story />} />
            </Routes>
          </QueryClientProvider>
        </ChakraProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn = (args) => <BookDetailsWithProvider {...args} />;

export const Default = Template.bind({});
Default.args = {};
