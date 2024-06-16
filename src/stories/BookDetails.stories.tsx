import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import BookDetails from "../components/BookDetails";
import { getBooks } from "../services/fakeBookService";

const books = getBooks();
const firstBook = books.length > 0 ? books[0] : null;

export default {
  title: "Components/BookDetails",
  component: BookDetails,
  decorators: [
    (Story) => (
      <MemoryRouter
        initialEntries={[`/books/${firstBook ? firstBook.id : "1"}`]}
      >
        <ChakraProvider>
          <Routes>
            <Route path="/books/:bookId" element={<Story />} />
          </Routes>
        </ChakraProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn = (args) => <BookDetails {...args} />;

export const Default = Template.bind({});
Default.args = {
  bookId: firstBook ? firstBook.id : "1",
};
