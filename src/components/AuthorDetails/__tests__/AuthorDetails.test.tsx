import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthorDetails } from "../AuthorDetails";
import { useOpenLibraryService } from "../../../hooks/useOpenLibraryService";
import { ChakraProvider } from "@chakra-ui/react";
import {
  OpenLibraryBook,
  OpenLibraryBookDetails,
  Author,
} from "../../../components/Books.type";

jest.mock("../../../hooks/useOpenLibraryService");

const mockUseOpenLibraryService = useOpenLibraryService as jest.MockedFunction<
  typeof useOpenLibraryService
>;

const mockAuthor: Author = {
  key: "/authors/OL23919A",
  name: "J.K. Rowling",
  birth_date: "1965-07-31",
  bio: {
    value:
      "J.K. Rowling is a British author, best known for the Harry Potter series.",
  },
  photos: true,
};

const createMockReturnValue = (overrides = {}) => ({
  books: [] as OpenLibraryBook[],
  book: null as OpenLibraryBookDetails | null,
  author: mockAuthor,
  isLoading: false,
  error: null as string | null,
  searchBooks: jest.fn().mockImplementation(() => Promise.resolve()),
  getBookDetails: jest.fn().mockImplementation(() => Promise.resolve()),
  getAuthorDetails: jest.fn().mockImplementation(() => Promise.resolve()),
  ...overrides,
});

jest.mock("@chakra-ui/react", () => {
  const originalModule = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...originalModule,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
  };
});

describe("AuthorDetails", () => {
  beforeEach(() => {
    mockUseOpenLibraryService.mockReturnValue(createMockReturnValue());
  });

  it("renders loading state", async () => {
    mockUseOpenLibraryService.mockReturnValueOnce(
      createMockReturnValue({
        author: null,
        isLoading: true,
      })
    );

    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={["/author/OL23919A"]}>
          <Routes>
            <Route path="/author/:authorId" element={<AuthorDetails />} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders error state", () => {
    const errorMessage = "Failed to fetch author details. Please try again.";
    mockUseOpenLibraryService.mockReturnValueOnce(
      createMockReturnValue({
        author: null,
        error: errorMessage,
      })
    );

    render(
      <MemoryRouter initialEntries={["/author/OL23919A"]}>
        <Routes>
          <Route path="/author/:authorId" element={<AuthorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders author details correctly", () => {
    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={["/author/OL23919A"]}>
          <Routes>
            <Route path="/author/:authorId" element={<AuthorDetails />} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText("J.K. Rowling")).toBeInTheDocument();
    expect(screen.getByText("Birth Date: 1965-07-31")).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          content.startsWith("Bio:") &&
          content.includes(
            "J.K. Rowling is a British author, best known for the Harry Potter series."
          )
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByAltText("Photo of J.K. Rowling")
    ).not.toBeInTheDocument();
  });

  it("handles author with no photos", () => {
    const authorWithNoPhotos: Author = {
      ...mockAuthor,
      photos: false,
    };

    mockUseOpenLibraryService.mockReturnValueOnce(
      createMockReturnValue({
        author: authorWithNoPhotos,
      })
    );

    render(
      <MemoryRouter initialEntries={["/author/OL23919A"]}>
        <Routes>
          <Route path="/author/:authorId" element={<AuthorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.queryByAltText("Photo of J.K. Rowling")
    ).not.toBeInTheDocument();
  });

  it("handles author with string bio", () => {
    const authorWithStringBio: Author = {
      ...mockAuthor,
      bio: "This is a string bio.",
    };

    mockUseOpenLibraryService.mockReturnValueOnce(
      createMockReturnValue({
        author: authorWithStringBio,
      })
    );

    render(
      <MemoryRouter initialEntries={["/author/OL23919A"]}>
        <Routes>
          <Route path="/author/:authorId" element={<AuthorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        (content, element) =>
          content.startsWith("Bio:") &&
          content.includes("This is a string bio.")
      )
    ).toBeInTheDocument();
  });
});
