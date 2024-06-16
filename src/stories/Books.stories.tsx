import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { getBooks } from "../services/fakeBookService";
import { getGenres } from "../services/fakeGenreService";
import { Book, Genre } from "../components/Books.type";
import Books from "../components/Books";
import BookCard from "../components/BookCard";
import BookList from "../components/BookList";
import GenreList from "../components/GenreList";
import SearchBox from "../components/SearchBox";

const queryClient = new QueryClient();
const books = getBooks();
const genres = getGenres();
const firstBook: Book | undefined = books.length > 0 ? books[0] : undefined;

const MemoryRouterDecorator =
  (initialEntries: string[]) => (Story: React.FC) => (
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

const BookCardTemplate: StoryFn<{ book: Book }> = (args) => (
  <Box width="400px">
    <BookCard {...args} />
  </Box>
);
const BookListTemplate: StoryFn<{
  books: Book[];
  onBookClick: (bookId: string) => void;
}> = (args) => (
  <Box width="900px">
    <BookList {...args} />
  </Box>
);
const BooksTemplate: StoryFn = (args) => <Books {...args} />;
const GenreListTemplate: StoryFn<{
  genres: Genre[];
  selectedGenre: Genre | null;
  onGenreSelect: (genre: Genre) => void;
}> = (args) => (
  <Box width="400px">
    <GenreList {...args} />
  </Box>
);
const SearchBoxTemplate: StoryFn<{
  value: string;
  onChange: (value: string) => void;
}> = (args) => (
  <Box width="400px">
    <SearchBox {...args} />
  </Box>
);

export const BookCardStory = BookCardTemplate.bind({});
BookCardStory.args = {
  book: firstBook!,
};

export const BookListStory = BookListTemplate.bind({});
BookListStory.args = {
  books,
  onBookClick: (bookId: string) => alert(`Book clicked: ${bookId}`),
};

export const BooksStory = BooksTemplate.bind({});
BooksStory.args = {};

export const GenreListStory = GenreListTemplate.bind({});
GenreListStory.args = {
  genres,
  selectedGenre: genres.length > 0 ? genres[0] : null,
  onGenreSelect: (genre: Genre) => alert(`Genre selected: ${genre.name}`),
};

export const SearchBoxStory = SearchBoxTemplate.bind({});
SearchBoxStory.args = {
  value: "",
  onChange: (value: string) => alert(`Search value: ${value}`),
};
