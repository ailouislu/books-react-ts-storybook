import { render, screen, waitFor } from "@testing-library/react";
import { BookPage } from "../BookPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useOpenLibraryService } from "../../../hooks/useOpenLibraryService";
import { act } from "react";

jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...actual,
    Spinner: () => <div data-testid="spinner" />,
    Image: () => null,
  };
});

jest.mock("../../images/default.jpg", () => "default-image-path", {
  virtual: true,
});

jest.mock("../../../hooks/useOpenLibraryService");

describe("BookPage", () => {
  const defaultServiceMock = {
    book: null,
    isLoading: false,
    error: null,
    getBookDetails: jest.fn(),
  };

  const renderWithRouter = (bookKey?: string) => {
    if (bookKey) {
      return render(
        <MemoryRouter initialEntries={[`/book/${bookKey}`]}>
          <Routes>
            <Route path="/book/:bookKey" element={<BookPage />} />
          </Routes>
        </MemoryRouter>
      );
    } else {
      return render(
        <MemoryRouter initialEntries={["/"]}>
          <BookPage />
        </MemoryRouter>
      );
    }
  };

  beforeEach(() => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      ...defaultServiceMock,
    });
    jest.clearAllMocks();
  });

  it("renders loading state", async () => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      book: null,
      isLoading: true,
      error: null,
      getBookDetails: jest.fn(),
    });

    await act(async () => {
      renderWithRouter("OL12345W");
    });

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders error state", async () => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      book: null,
      isLoading: false,
      error: "Failed to load book details",
      getBookDetails: jest.fn(),
    });

    await act(async () => {
      renderWithRouter("OL12345W");
    });

    expect(screen.getByText("Failed to load book details")).toBeInTheDocument();
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
      book: mockBook,
      isLoading: false,
      error: null,
      getBookDetails: jest.fn(),
    });

    await act(async () => {
      renderWithRouter("OL12345W");
    });

    await waitFor(() => {
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    });

    expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
    expect(screen.getByText("First published: 1925")).toBeInTheDocument();
    expect(screen.getByText("CLASSIC LITERATURE")).toBeInTheDocument();
    expect(screen.getByText("AMERICAN NOVEL")).toBeInTheDocument();
    expect(screen.getByText("JAZZ AGE")).toBeInTheDocument();
    expect(
      screen.getByText("A novel about the American Dream in the Jazz Age.")
    ).toBeInTheDocument();
  });

  it("renders message when no book details are available", async () => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      book: null,
      isLoading: false,
      error: null,
      getBookDetails: jest.fn(),
    });

    await act(async () => {
      renderWithRouter("OL12345W");
    });

    expect(screen.getByText("No book details available.")).toBeInTheDocument();
  });

  it("renders message when no book key is provided", async () => {
    await act(async () => {
      renderWithRouter();
    });

    expect(screen.getByText("No book key provided")).toBeInTheDocument();
  });
});
