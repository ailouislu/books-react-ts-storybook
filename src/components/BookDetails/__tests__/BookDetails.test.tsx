import { render, screen } from "@testing-library/react";
import { BookDetails } from "../BookDetails";
import { OpenLibraryBookDetails } from "../../Books.type";

jest.mock("@chakra-ui/react", () => {
  const originalModule = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...originalModule,
    Spinner: jest.fn(() => <div data-testid="spinner" />),
    Image: jest.fn((props) => null),
  };
});

const mockBook: OpenLibraryBookDetails = {
  title: "The Great Gatsby",
  authors: [{ author: { key: "OL12345A", name: "F. Scott Fitzgerald" } }],
  first_publish_date: "1925",
  subjects: ["Classic Literature", "American Novel", "Jazz Age"],
  description: { value: "A novel about the American Dream in the Jazz Age." },
};

describe("BookDetails", () => {
  it("renders error state", () => {
    const errorMessage = "Failed to load book details";
    render(
      <BookDetails
        book={mockBook}
        imageSrc=""
        isLoading={false}
        error={errorMessage}
      />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders book details correctly", async () => {
    render(
      <BookDetails
        book={mockBook}
        imageSrc="book-cover.jpg"
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
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
    render(
      <BookDetails
        book={bookWithNoAuthors}
        imageSrc=""
        isLoading={false}
        error={null}
      />
    );
    expect(
      screen.queryByText(/by F. Scott Fitzgerald/)
    ).not.toBeInTheDocument();
  });

  it("handles book with multiple authors", () => {
    const bookWithMultipleAuthors = {
      ...mockBook,
      authors: [
        { author: { key: "OL12345A", name: "Author One" } },
        { author: { key: "OL67890B", name: "Author Two" } },
      ],
    };
    render(
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
    render(
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

  it("handles book with no subjects", () => {
    const bookWithNoSubjects = { ...mockBook, subjects: undefined };
    render(
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
    render(
      <BookDetails
        book={bookWithNoPublishDate}
        imageSrc=""
        isLoading={false}
        error={null}
      />
    );
    expect(screen.queryByText(/First published:/)).not.toBeInTheDocument();
  });
});
