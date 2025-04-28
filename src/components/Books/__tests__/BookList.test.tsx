import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BookList from "../BookList";
import { MemoryRouter } from "react-router-dom";
import { Book } from "../../Books.type";

jest.mock("../../BookCard", () => {
  return {
    BookCard: ({ bookId }: { bookId: string }) => (
      <div data-testid="book-card">{bookId}</div>
    ),
  };
});

const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    subtitle: "A Novel",
    type: "Fiction",
    format: "Hardcover",
    releaseDate: "1925-04-10",
    author: "F. Scott Fitzgerald",
    price: 10.99,
    publisherRRP: 15.99,
    pages: 180,
    description: "A novel about the American Dream in the Jazz Age.",
    dimensions: "8.5 x 5.5 x 1 inches",
    wishList: false,
    bestSeller: true,
    isbn: "9780743273565",
    publisher: "Scribner",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    subtitle: "A Novel",
    type: "Fiction",
    format: "Paperback",
    releaseDate: "1960-07-11",
    author: "Harper Lee",
    price: 7.99,
    publisherRRP: 12.99,
    pages: 281,
    description: "A novel about racial injustice in the Deep South.",
    dimensions: "8.0 x 5.3 x 0.8 inches",
    wishList: true,
    bestSeller: true,
    isbn: "9780061120084",
    publisher: "J.B. Lippincott & Co.",
  },
];

describe("BookList", () => {
  const onBookClick = jest.fn();

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <BookList books={mockBooks} onBookClick={onBookClick} />
      </MemoryRouter>
    );

  beforeEach(() => {
    onBookClick.mockClear();
  });

  it("renders the correct number of BookCard components", () => {
    renderComponent();
    expect(screen.getAllByTestId("book-card").length).toBe(mockBooks.length);
  });

  it("calls onBookClick with the correct book id when a book is clicked", () => {
    renderComponent();
    const firstBookCard = screen.getByText("1");
    fireEvent.click(firstBookCard);
    expect(onBookClick).toHaveBeenCalledWith("1");
  });
});
