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
    useBreakpointValue: (values: any) => {
      // Mocking useBreakpointValue to return a fixed value
      if (typeof values === "object" && values.md) {
        return values.md;
      }
      if (Array.isArray(values) && values[1]) {
        return values[1];
      }

      return values;
    },
    Skeleton: ({ children, ...props }: any) => (
      <div data-testid="skeleton" {...props}>
        {children}
      </div>
    ),
    SkeletonText: ({ children, ...props }: any) => (
      <div data-testid="skeleton-text" {...props}>
        {children}
      </div>
    ),
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

  it("renders loading skeletons when isLoading is true", async () => {
    (useOpenLibraryService as jest.Mock).mockReturnValue({
      book: null,
      isLoading: true,
      error: null,
      getBookDetails: jest.fn(),
    });

    await act(async () => {
      renderWithRouter("OL12345W");
    });

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("skeleton-text").length).toBeGreaterThan(0);
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

    expect(screen.getByText("Failed to load book details")).toBeVisible();
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

    expect(screen.getByText("F. Scott Fitzgerald")).toBeVisible();
    expect(screen.getByText("First published: 1925")).toBeVisible();
    expect(screen.getByText("CLASSIC LITERATURE")).toBeVisible();
    expect(screen.getByText("AMERICAN NOVEL")).toBeVisible();
    expect(screen.getByText("JAZZ AGE")).toBeVisible();
    expect(
      screen.getByText("A novel about the American Dream in the Jazz Age.")
    ).toBeVisible();
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

    expect(screen.getByText("No book details available.")).toBeVisible();
  });

  it("renders message when no book key is provided", async () => {
    await act(async () => {
      renderWithRouter();
    });

    expect(screen.getByText("No book key provided")).toBeVisible();
  });
});
