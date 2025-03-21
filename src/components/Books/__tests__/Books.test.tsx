import { render, screen } from "@testing-library/react";
import Books from "../Books";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import { useBooksData } from "../../../hooks/useBooksData";
import { useGenresStore } from "../../../hooks/useGenresData";
import axios from "axios";
import { Book } from "../../Books.type";

jest.mock("axios");
jest.mock("../../../hooks/useBooksData");
jest.mock("../../../hooks/useGenresData");

(axios as any).isAxiosError = jest.fn((err) => err instanceof Error);

jest.mock("../BookList", () => {
  return {
    __esModule: true,
    default: ({ books }: { books: Book[] }) => (
      <div data-testid="book-list">
        {books.map((book) => (
          <div key={book.id}>{book.id}</div>
        ))}
      </div>
    ),
  };
});

jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...actual,
    Spinner: () => <div data-testid="spinner" />,
    useBreakpointValue: (props: any) => props.md || props.base,
  };
});

describe("Books component", () => {
  const mockBooksData = {
    books: [],
    isLoading: false,
    error: null,
    searchBooks: jest.fn(),
    getBookDetails: jest.fn(),
  };

  const mockFetchGenres = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useGenresStore as unknown as jest.Mock).mockReturnValue({
      genres: [{ id: "popular", name: "Popular" }],
      isLoading: false,
      error: null,
      hasLoaded: true,
      fetchGenres: mockFetchGenres,
    });

    (useBooksData as jest.Mock).mockReturnValue(mockBooksData);
  });

  const renderComponent = (props = {}) =>
    render(
      <ChakraProvider>
        <MemoryRouter>
          <Books
            books={mockBooksData.books}
            isLoading={mockBooksData.isLoading}
            error={mockBooksData.error}
            searchBooks={mockBooksData.searchBooks}
            handleGenreSelect={jest.fn()}
            handleSearch={jest.fn()}
            handleBookClick={jest.fn()}
            selectedGenre={{ id: "popular", name: "Popular" }}
            searchQuery=""
            {...props}
          />
        </MemoryRouter>
      </ChakraProvider>
    );

  it("renders loading state when books are loading", () => {
    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      isLoading: true,
    });
    renderComponent();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders error state when there is an error", () => {
    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      error: "Error fetching books",
    });
    renderComponent();
    expect(
      screen.getByText("An error occurred while fetching data.")
    ).toBeInTheDocument();
  });

  it("renders no books message when filtered books is empty", () => {
    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      books: [],
    });
    renderComponent();
    expect(
      screen.getByText("There are no books in the database.")
    ).toBeInTheDocument();
  });

  it("renders BookList when filtered books exist", () => {
    const mockBooks = [
      {
        id: "1",
        title: "The Great Gatsby",
        subtitle: "A Novel",
        type: "Fiction",
        format: "Hardcover",
        releaseDate: "1925-04-10",
        author: "F. Scott Fitzgerald",
        price: 10.99,
        publisherRRP: 15.99,
        pages: 180,
        description: "A novel about the American Dream in the Jazz Age.",
        dimensions: "8.5 x 5.5 x 1 inches",
        wishList: false,
        bestSeller: true,
        isbn: "9780743273565",
        publisher: "Scribner",
      },
      {
        id: "2",
        title: "To Kill a Mockingbird",
        subtitle: "A Novel",
        type: "Fiction",
        format: "Paperback",
        releaseDate: "1960-07-11",
        author: "Harper Lee",
        price: 7.99,
        publisherRRP: 12.99,
        pages: 281,
        description: "A novel about racial injustice in the Deep South.",
        dimensions: "8.0 x 5.3 x 0.8 inches",
        wishList: true,
        bestSeller: true,
        isbn: "9780061120084",
        publisher: "J.B. Lippincott & Co.",
      },
    ];
    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      books: mockBooks,
    });
    renderComponent();

    expect(screen.getByTestId("book-list")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("fetches genres on mount", () => {
    renderComponent();
    expect(mockFetchGenres).toHaveBeenCalled();
  });
});
