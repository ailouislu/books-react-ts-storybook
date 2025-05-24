import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Authors from "../Authors";
import { useAuthorsData } from "../../../hooks/useAuthorsData";
import { useGenresStore } from "../../../hooks/useGenresData";
import { ChakraProvider } from "@chakra-ui/react";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../hooks/useAuthorsData");
jest.mock("../../../hooks/useGenresData");
jest.mock("../../GenreList", () => {
  return function GenreList({ onGenreSelect }: any) {
    return (
      <div data-testid="genre-list">
        <button onClick={() => onGenreSelect({ id: "fiction", name: "Fiction" })}>
          Fiction
        </button>
      </div>
    );
  };
});
jest.mock("../AuthorList", () => {
  return function AuthorList({ authors, onAuthorClick }: any) {
    return (
      <div data-testid="author-list">
        {authors.map((author: any) => (
          <div key={author.key} onClick={() => onAuthorClick(author.key)}>
            {author.name}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...actual,
    Skeleton: (props: any) => {
      const { noOfLines, spacing, ...restProps } = props;
      return <div data-testid="skeleton" {...restProps}>Loading skeleton</div>;
    },
    SkeletonCircle: (props: any) => {
      const { noOfLines, spacing, ...restProps } = props;
      return <div data-testid="skeleton-circle" {...restProps}>Loading circle skeleton</div>;
    },
  };
});

const mockAuthors = [
  {
    key: "/authors/OL23919A",
    name: "J.K. Rowling",
    birth_date: "1965-07-31",
    work_count: 15,
  },
  {
    key: "/authors/OL26320A",
    name: "Stephen King",
    birth_date: "1947-09-21",
    work_count: 87,
  },
];

const mockGenres = [
  { id: "fiction", name: "Fiction" },
  { id: "science", name: "Science" },
];

describe("Authors", () => {
  const defaultAuthorsData = {
    authors: mockAuthors,
    total: 2,
    isLoading: false,
    error: null,
    hasMore: false,
    loadMore: jest.fn(),
  };

  const defaultGenresStore = {
    genres: mockGenres,
    fetchGenres: jest.fn(),
  };

  beforeEach(() => {
    (useAuthorsData as jest.Mock).mockReturnValue(defaultAuthorsData);
    (useGenresStore as unknown as jest.Mock).mockReturnValue(defaultGenresStore);
    mockNavigate.mockClear();
  });

  const renderComponent = (subject = "fiction") => {
    return render(
      <ChakraProvider>
        <MemoryRouter>
          <Authors subject={subject} />
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  it("renders loading skeleton when isLoading is true and no authors", () => {
    (useAuthorsData as jest.Mock).mockReturnValue({
      ...defaultAuthorsData,
      authors: [],
      isLoading: true,
    });

    renderComponent();

    expect(screen.getAllByTestId("skeleton-circle")).toHaveLength(9);
    expect(screen.getAllByTestId("skeleton")).toHaveLength(9);
  });

  it("renders authors list when data is loaded", () => {
    renderComponent();

    expect(screen.getByText("J.K. Rowling")).toBeInTheDocument();
    expect(screen.getByText("Stephen King")).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === "Showing 2 of 2 authors";
    })).toBeInTheDocument();
  });

  it("renders error state when there is an error and no authors", () => {
    (useAuthorsData as jest.Mock).mockReturnValue({
      ...defaultAuthorsData,
      authors: [],
      error: "Failed to fetch authors",
    });

    renderComponent();

    expect(screen.getByText("Failed to fetch authors")).toBeInTheDocument();
  });

  it("filters authors based on search query", async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText("Search authors...");
    fireEvent.change(searchInput, { target: { value: "Rowling" } });

    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent === "Showing 1 of 2 authors";
      })).toBeInTheDocument();
    });
  });

  it("renders no authors match when filtered results are empty", async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText("Search authors...");
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });

    await waitFor(() => {
      expect(screen.getByText("No authors match.")).toBeInTheDocument();
    });
  });

  it("navigates when genre is selected", () => {
    renderComponent();

    const fictionButton = screen.getByText("Fiction");
    fireEvent.click(fictionButton);

    expect(mockNavigate).toHaveBeenCalledWith("/authors/subject/fiction");
  });
});