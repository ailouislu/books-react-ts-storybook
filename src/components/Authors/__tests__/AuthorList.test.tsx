import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import AuthorList from "../AuthorList";
import { useInView } from "react-intersection-observer";

jest.mock("react-intersection-observer");

const mockAuthorCardClick = jest.fn();

jest.mock("../AuthorCard", () => {
  return function MockAuthorCard({ author }: { author: any }) {
    return (
      <div
        data-testid="author-card"
        onClick={() => {
          mockAuthorCardClick(author.key);
        }}
      >
        <div data-testid="avatar">{author.name}</div>
        <div>{author.name}</div>
      </div>
    );
  };
});

jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...actual,
    Avatar: (props: any) => {
      const { name, src, ...restProps } = props;
      return (
        <div data-testid="avatar" {...restProps}>
          {name}
        </div>
      );
    },
    Spinner: (props: any) => {
      return (
        <div data-testid="spinner" {...props}>
          Loading...
        </div>
      );
    },
  };
});

const mockAuthors = [
  {
    key: "/authors/OL23919A",
    name: "J.K. Rowling",
    birth_date: "1965-07-31",
    work_count: 15,
    photos: ["https://example.com/photo1.jpg"],
  },
  {
    key: "/authors/OL26320A",
    name: "Stephen King",
    birth_date: "1947-09-21",
    work_count: 87,
    photos: ["https://example.com/photo2.jpg"],
  },
  {
    key: "/authors/OL12345A",
    name: "George Orwell",
    birth_date: "1903-06-25",
    work_count: 25,
    photos: [],
  },
];

describe("AuthorList", () => {
  const mockOnLoadMore = jest.fn();
  const mockOnAuthorClick = jest.fn();
  const mockUseInView = useInView as jest.Mock;

  beforeEach(() => {
    mockOnLoadMore.mockClear();
    mockOnAuthorClick.mockClear();
    mockAuthorCardClick.mockClear();
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    });
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      authors: mockAuthors,
      hasMore: false,
      isLoadingMore: false,
      onLoadMore: mockOnLoadMore,
      onAuthorClick: mockOnAuthorClick,
    };

    return render(
      <BrowserRouter>
        <ChakraProvider>
          <AuthorList {...defaultProps} {...props} />
        </ChakraProvider>
      </BrowserRouter>
    );
  };

  it("renders authors list correctly", () => {
    renderComponent();

    expect(screen.getAllByText("J.K. Rowling")).toHaveLength(2);
    expect(screen.getAllByText("Stephen King")).toHaveLength(2);
    expect(screen.getAllByText("George Orwell")).toHaveLength(2);
    expect(screen.getAllByTestId("author-card")).toHaveLength(3);
  });

  it("calls onAuthorClick when author is clicked", async () => {
    renderComponent();

    const authorCard = screen.getAllByTestId("author-card")[0];
    fireEvent.click(authorCard);

    await waitFor(() => {
      expect(mockAuthorCardClick).toHaveBeenCalledWith("/authors/OL23919A");
    });
  });

  it("does not render spinner when hasMore is false and not loading", () => {
    renderComponent({
      hasMore: false,
      isLoadingMore: false,
    });

    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });

  it("renders spinner when hasMore is true", () => {
    renderComponent({
      hasMore: true,
      isLoadingMore: false,
    });

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders spinner when isLoadingMore is true", () => {
    renderComponent({
      hasMore: false,
      isLoadingMore: true,
    });

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("does not render spinner when onLoadMore is not provided", () => {
    renderComponent({
      hasMore: true,
      isLoadingMore: false,
      onLoadMore: undefined,
    });

    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });

  it("calls onLoadMore when in view and hasMore is true", async () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });

    renderComponent({
      hasMore: true,
      isLoadingMore: false,
    });

    await waitFor(() => {
      expect(mockOnLoadMore).toHaveBeenCalled();
    });
  });

  it("does not call onLoadMore when not in view", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    });

    renderComponent({
      hasMore: true,
      isLoadingMore: false,
    });

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it("does not call onLoadMore when hasMore is false", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });

    renderComponent({
      hasMore: false,
      isLoadingMore: false,
    });

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it("does not call onLoadMore when isLoadingMore is true", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });

    renderComponent({
      hasMore: true,
      isLoadingMore: true,
    });

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it("does not call onLoadMore when onLoadMore is not provided", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });

    renderComponent({
      hasMore: true,
      isLoadingMore: false,
      onLoadMore: undefined,
    });

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it("renders empty list when no authors provided", () => {
    renderComponent({
      authors: [],
    });

    expect(screen.queryByTestId("author-card")).not.toBeInTheDocument();
    expect(screen.queryByText("J.K. Rowling")).not.toBeInTheDocument();
  });

  it("handles authors with no photos", () => {
    renderComponent({
      authors: [mockAuthors[2]],
    });

    expect(screen.getAllByText("George Orwell")).toHaveLength(2);
    expect(screen.getByTestId("author-card")).toBeInTheDocument();
  });
});
