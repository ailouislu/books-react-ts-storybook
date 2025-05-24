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

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

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
  photos: ["photo-id-1"],
};

const createMockReturnValue = (overrides = {}) => ({
  books: [] as OpenLibraryBook[],
  book: null as OpenLibraryBookDetails | null,
  author: mockAuthor,
  isLoading: false,
  error: null as string | null,
  searchBooks: jest.fn().mockResolvedValue(undefined),
  getBookDetails: jest.fn().mockResolvedValue(undefined),
  getAuthorDetails: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

jest.mock("@chakra-ui/react", () => {
  const mod = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...mod,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    Skeleton: (props: any) => {
      const { noOfLines, spacing, ...restProps } = props;
      return <div data-testid="skeleton" {...restProps}>Loading skeleton</div>;
    },
    SkeletonText: (props: any) => {
      const { noOfLines, spacing, ...restProps } = props;
      return <div data-testid="skeleton-text" {...restProps}>Loading text skeleton</div>;
    },
    useBreakpointValue: (vals: any) => vals.base,
  };
});

describe("AuthorDetails", () => {
  beforeEach(() => {
    mockUseOpenLibraryService.mockReturnValue(createMockReturnValue());
  });

  it("renders loading skeleton when isLoading is true", () => {
    mockUseOpenLibraryService.mockReturnValue(
      createMockReturnValue({ isLoading: true, author: null })
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
    expect(screen.getAllByTestId("skeleton")).toHaveLength(2);
    expect(screen.getAllByTestId("skeleton-text")).toHaveLength(2);
  });

  it("renders error state", () => {
    const errorMessage = "Failed to fetch author details. Please try again.";
    mockUseOpenLibraryService.mockReturnValue(
      createMockReturnValue({ author: null, error: errorMessage })
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
      screen.getByText(/best known for the Harry Potter series\./)
    ).toBeInTheDocument();
    const img = screen.getByAltText("Photo of J.K. Rowling");
    expect(img).toHaveAttribute("src", expect.stringContaining(".jpg"));
  });

  it("handles author with no photos", () => {
    const authorWithNoPhotos: Author = { ...mockAuthor, photos: [] };
    mockUseOpenLibraryService.mockReturnValue(
      createMockReturnValue({ author: authorWithNoPhotos })
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
    const defaultImg = screen.getByAltText("Photo of J.K. Rowling");
    expect(defaultImg).toHaveAttribute(
      "src",
      expect.stringContaining("default.jpg")
    );
  });

  it("handles author with string bio", () => {
    const authorWithStringBio: Author = {
      ...mockAuthor,
      bio: "This is a string bio.",
    };
    mockUseOpenLibraryService.mockReturnValue(
      createMockReturnValue({ author: authorWithStringBio })
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
    expect(screen.getByText("Bio: This is a string bio.")).toBeInTheDocument();
  });
});