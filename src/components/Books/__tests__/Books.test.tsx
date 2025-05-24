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

jest.mock("../BookList", () => ({
  __esModule: true,
  default: () => <div data-testid="book-list" />,
}));

jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...actual,
    Spinner: () => <div data-testid="spinner" />,
    Skeleton: ({ children, height, mb, ...rest }: any) => {
      const domProps = Object.keys(rest).reduce((acc, key) => {
        if (key.startsWith('data-') || key === 'className' || key === 'id') {
          acc[key] = rest[key];
        }
        return acc;
      }, {} as any);
      
      return (
        <div data-testid="skeleton" {...domProps}>
          {children}
        </div>
      );
    },
    SkeletonText: ({ children, noOfLines, spacing, width, mt, ...rest }: any) => {
      const domProps = Object.keys(rest).reduce((acc, key) => {
        if (key.startsWith('data-') || key === 'className' || key === 'id') {
          acc[key] = rest[key];
        }
        return acc;
      }, {} as any);
      
      return (
        <div data-testid="skeleton-text" {...domProps}>
          {children}
        </div>
      );
    },
    useBreakpointValue: (props: any) => props.md || props.base,
  };
});

describe("Books component", () => {
  const mockBooksData = {
    books: [],
    total: 0,
    isLoading: false,
    error: null,
    hasMore: false,
    loadMore: jest.fn(),
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

  const renderComponent = () =>
    render(
      <ChakraProvider>
        <MemoryRouter>
          <Books />
        </MemoryRouter>
      </ChakraProvider>
    );

  it("renders skeleton loading state when isLoading is true and no books exist", () => {
    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      isLoading: true,
      books: [],
    });

    renderComponent();

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons).toHaveLength(6);

    const skeletonTexts = screen.getAllByTestId("skeleton-text");
    expect(skeletonTexts).toHaveLength(12);

    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  it("does not render skeleton when isLoading is true but books exist", () => {
    const mockBooks: Book[] = [
      { id: "1", title: "The Great Gatsby" },
    ] as Book[];

    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      isLoading: true,
      books: mockBooks,
    });

    renderComponent();

    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    
    expect(screen.getByTestId("book-list")).toBeInTheDocument();
  });

  it("does not render skeleton when isLoading is false", () => {
    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      isLoading: false,
      books: [],
    });

    renderComponent();

    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    
    expect(screen.getByText("No books match.")).toBeInTheDocument();
  });

  it("renders error state when there is an error", () => {
    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      error: "Error fetching books",
    });
    renderComponent();
    expect(screen.getByText("An error occurred.")).toBeInTheDocument();
  });

  it("renders no books message when filtered books is empty", () => {
    renderComponent();
    expect(screen.getByText("No books match.")).toBeInTheDocument();
  });

  it("renders BookList when filtered books exist", () => {
    const mockBooks: Book[] = [
      { id: "1", title: "The Great Gatsby" },
      { id: "2", title: "To Kill a Mockingbird" },
    ] as Book[];

    (useBooksData as jest.Mock).mockReturnValue({
      ...mockBooksData,
      books: mockBooks,
    });

    renderComponent();
    expect(screen.getByTestId("book-list")).toBeInTheDocument();
  });

  it("fetches genres on mount", () => {
    renderComponent();
    expect(mockFetchGenres).toHaveBeenCalled();
  });
});