import { render, screen, fireEvent } from "@testing-library/react";
import { BookDetails } from "../BookDetails";
import { OpenLibraryBookDetails } from "../../Books.type";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@chakra-ui/react", () => {
  const originalModule = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...originalModule,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    Image: ({ src, alt, onLoad, ...props }) => (
      <img
        src={src}
        alt={alt}
        data-testid="book-image"
        onClick={() => onLoad && onLoad()}
        {...props}
      />
    ),
  };
});

jest.mock("@chakra-ui/icons", () => ({
  ChevronLeftIcon: () => <span data-testid="chevron-left-icon" />,
}));

const mockBook: OpenLibraryBookDetails = {
  title: "The Great Gatsby",
  authors: [{ author: { key: "OL12345A", name: "F. Scott Fitzgerald" } }],
  first_publish_date: "1925",
  subjects: ["Classic Literature", "American Novel", "Jazz Age"],
  description: { value: "A novel about the American Dream in the Jazz Age." },
};

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("BookDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    const { container } = renderWithRouter(
      <BookDetails book={mockBook} imageSrc="" isLoading={true} error={null} />
    );

    expect(container.textContent).toContain("Loading...");
  });

  it("renders error state", () => {
    const errorMessage = "Failed to load book details";
    renderWithRouter(
      <BookDetails
        book={mockBook}
        imageSrc=""
        isLoading={false}
        error={errorMessage}
      />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders book details correctly", () => {
    renderWithRouter(
      <BookDetails
        book={mockBook}
        imageSrc="book-cover.jpg"
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText(/F. Scott Fitzgerald/)).toBeInTheDocument();
    expect(screen.getByText("First published: 1925")).toBeInTheDocument();
    expect(screen.getByText("CLASSIC LITERATURE")).toBeInTheDocument();
    expect(screen.getByText("AMERICAN NOVEL")).toBeInTheDocument();
    expect(screen.getByText("JAZZ AGE")).toBeInTheDocument();
    expect(
      screen.getByText("A novel about the American Dream in the Jazz Age.")
    ).toBeInTheDocument();
  });

  it("handles book with no authors", () => {
    const bookWithNoAuthors = { ...mockBook, authors: [] };
    renderWithRouter(
      <BookDetails
        book={bookWithNoAuthors}
        imageSrc=""
        isLoading={false}
        error={null}
      />
    );
    expect(screen.getByText("by")).toBeInTheDocument();
    expect(screen.queryByText(/F. Scott Fitzgerald/)).not.toBeInTheDocument();
  });

  it("handles book with multiple authors", () => {
    const bookWithMultipleAuthors = {
      ...mockBook,
      authors: [
        { author: { key: "OL12345A", name: "Author One" } },
        { author: { key: "OL67890B", name: "Author Two" } },
      ],
    };
    renderWithRouter(
      <BookDetails
        book={bookWithMultipleAuthors}
        imageSrc=""
        isLoading={false}
        error={null}
      />
    );
    expect(screen.getByText("Author One、Author Two")).toBeInTheDocument();
  });

  it("handles book with string description", () => {
    const bookWithStringDescription = {
      ...mockBook,
      description: "This is a string description.",
    };
    renderWithRouter(
      <BookDetails
        book={bookWithStringDescription}
        imageSrc=""
        isLoading={false}
        error={null}
      />
    );
    expect(
      screen.getByText("This is a string description.")
    ).toBeInTheDocument();
  });

  it("handles book with no description", () => {
    const bookWithNoDescription = {
      ...mockBook,
      description: undefined,
    };
    renderWithRouter(
      <BookDetails
        book={bookWithNoDescription}
        imageSrc=""
        isLoading={false}
        error={null}
      />
    );
    expect(screen.queryByText(/A novel about/)).not.toBeInTheDocument();
  });

  it("handles book with no subjects", () => {
    const bookWithNoSubjects = { ...mockBook, subjects: undefined };
    renderWithRouter(
      <BookDetails
        book={bookWithNoSubjects}
        imageSrc=""
        isLoading={false}
        error={null}
      />
    );
    expect(screen.queryByText("CLASSIC LITERATURE")).not.toBeInTheDocument();
  });

  it("handles book with no publish date", () => {
    const bookWithNoPublishDate = {
      ...mockBook,
      first_publish_date: undefined,
    };
    renderWithRouter(
      <BookDetails
        book={bookWithNoPublishDate}
        imageSrc=""
        isLoading={false}
        error={null}
      />
    );
    expect(screen.queryByText(/First published:/)).not.toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    renderWithRouter(
      <BookDetails
        book={mockBook}
        imageSrc="book-cover.jpg"
        isLoading={false}
        error={null}
      />
    );

    const backButton = screen.getByText("Back to Books");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
