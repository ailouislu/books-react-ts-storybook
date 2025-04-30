import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import axios, { AxiosError } from "axios";
import { GenreListProps } from "./components/GenreList";
import { BookListProps } from "./components/Books";
import { SearchBarProps } from "./components/SearchBar";
import { BookCardProps } from "./components/BookCard";

jest.mock("./components/Books/BookList", () => {
  return {
    __esModule: true,
    default: ({ books, onBookClick }: BookListProps) => (
      <div data-testid="book-list">
        {books.map((book) => (
          <div
            key={book.id}
            data-testid="book-item"
            onClick={() => onBookClick && onBookClick(book.id)}
          >
            <h3>{book.title}</h3>
            <p data-testid="author-name">Author: {book.author}</p>
          </div>
        ))}
      </div>
    ),
  };
});

jest.mock("./components/GenreList", () => ({
  __esModule: true,
  default: ({ genres, selectedGenre, onGenreSelect }: GenreListProps) => (
    <ul data-testid="genre-list">
      {genres.map((genre) => (
        <li
          key={genre.id}
          onClick={() => onGenreSelect(genre)}
          data-selected={selectedGenre?.id === genre.id}
        >
          {genre.name}
        </li>
      ))}
    </ul>
  ),
}));

jest.mock("./components/SearchBar", () => ({
  __esModule: true,
  default: ({ searchQuery, onSearch, bookCount }: SearchBarProps) => (
    <div data-testid="search-bar">
      <p>Showing {bookCount} books in the database.</p>
      <input
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search..."
      />
    </div>
  ),
}));

jest.mock("./components/BookCard/BookCard", () => ({
  BookCard: ({ bookId }: BookCardProps) => (
    <div data-testid="book-card">Book Card: {bookId}</div>
  ),
}));

jest.mock("./hooks/useOpenLibraryService", () => ({
  useOpenLibraryService: () => ({
    book: {
      title: "Test Book",
      authors: [{ author: { name: "Test Author" } }],
      covers: [12345],
      description: "Test description",
    },
    isLoading: false,
    error: null,
    getBookDetails: jest.fn(),
  }),
}));

jest.mock("./hooks/useBooksData", () => ({
  useBooksData: () => ({
    books: [
      {
        key: "/works/OL1W",
        title: "Test Book 1",
        author: "Author 1",
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

jest.mock("./hooks/useGenresData", () => ({
  useGenresStore: () => ({
    genres: [
      { id: "popular", name: "Popular" },
      { id: "fiction", name: "Fiction" },
    ],
    selectedGenre: { id: "popular", name: "Popular" },
    fetchGenres: jest.fn(),
  }),
}));

jest.mock("axios");

beforeAll(() => {
  global.window.matchMedia =
    global.window.matchMedia ||
    (() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

  (axios as any).isAxiosError = (error: any): error is AxiosError => {
    return error.isAxiosError === true;
  };
});

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Books component at '/' route", async () => {
    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </ChakraProvider>
    );

    const bookItems = await screen.findAllByTestId("book-item");
    expect(bookItems).toHaveLength(1);

    const titles = await screen.findAllByRole("heading", { level: 3 });
    expect(titles[0]).toHaveTextContent("Test Book 1");

    const authorElements = await screen.findAllByTestId("author-name");
    expect(authorElements[0]).toHaveTextContent("Author:");
  });
});
