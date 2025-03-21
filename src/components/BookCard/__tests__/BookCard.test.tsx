import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BookCard } from "../BookCard";
import { MemoryRouter } from "react-router-dom";
import { useOpenLibraryService } from "../../../hooks/useOpenLibraryService";

jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...actual,
    Image: (props: any) => <img {...props} />,
  };
});

jest.mock("../../../hooks/useOpenLibraryService");

describe("BookCard", () => {
  const defaultServiceMock = {
    book: null,
    isLoading: false,
    error: null,
    getBookDetails: jest.fn(),
  };

  const renderComponent = (bookId: string) => {
    return render(
      <MemoryRouter>
        <BookCard bookId={bookId} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      ...defaultServiceMock,
    });
  });

  it("calls getBookDetails with proper book key", () => {
    const getBookDetailsMock = jest.fn();
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      ...defaultServiceMock,
      getBookDetails: getBookDetailsMock,
    });
    const bookId = "/works/OL12345W";
    renderComponent(bookId);
    expect(getBookDetailsMock).toHaveBeenCalledWith("OL12345W");
  });

  it("renders loading state", () => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      ...defaultServiceMock,
      isLoading: true,
      getBookDetails: jest.fn(),
    });
    renderComponent("/works/OL12345W");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      ...defaultServiceMock,
      error: "Failed to load book details",
      getBookDetails: jest.fn(),
    });
    renderComponent("/works/OL12345W");
    expect(screen.getByText("Failed to load book details")).toBeInTheDocument();
  });

  it("renders no book details available state", () => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      ...defaultServiceMock,
      book: null,
      getBookDetails: jest.fn(),
    });
    renderComponent("/works/OL12345W");
    expect(screen.getByText("No book details available.")).toBeInTheDocument();
  });

  it("renders book details correctly", async () => {
    const mockBook = {
      title: "The Great Gatsby",
      authors: [{ author: { key: "OL12345A", name: "F. Scott Fitzgerald" } }],
      first_publish_date: "1925",
      subjects: ["Classic Literature", "American Novel", "Jazz Age"],
      description: {
        value: "A novel about the American Dream in the Jazz Age.",
      },
      covers: [12345],
    };
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      ...defaultServiceMock,
      book: mockBook,
      getBookDetails: jest.fn(),
    });
    renderComponent("/works/OL12345W");
    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "https://covers.openlibrary.org/b/id/12345-M.jpg"
      );
    });
    expect(screen.getByRole("img")).toHaveAttribute("alt", "The Great Gatsby");
    expect(
      screen.getByRole("heading", { name: "The Great Gatsby" })
    ).toBeInTheDocument();
    expect(screen.getByText("Author: F. Scott Fitzgerald")).toBeInTheDocument();
  });
});
