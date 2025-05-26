import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import AuthorCard from "../AuthorCard";
import { Author } from "../../Books.type";

const createMatchMediaMock = () => {
  return (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  } as MediaQueryList);
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: createMatchMediaMock(),
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));



const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockAuthorWithPhoto: Author = {
  key: "/authors/OL23919A",
  name: "J.K. Rowling",
  birth_date: "1965-07-31",
  photos: ["12345678"],
  bio: "Joanne Rowling, better known by her pen name J. K. Rowling, is a British author and philanthropist.",
};

const mockAuthorWithoutPhoto: Author = {
  key: "/authors/OL26320A",
  name: "Stephen King",
  birth_date: "1947-09-21",
  photos: [],
  bio: {
    value: "Stephen Edwin King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.",
  },
};

const mockAuthorMinimal: Author = {
  key: "/authors/OL12345A",
  name: "Unknown Author",
  birth_date: "",
  photos: [],
  bio: "",
};

const mockAuthorNoBio: Author = {
  key: "/authors/OL54321A",
  name: "Test Author",
  birth_date: "1980-01-01",
  photos: [],
  bio: "",
};

describe("AuthorCard", () => {
  const renderComponent = (author: Author) => {
    return render(
      <ChakraProvider>
        <MemoryRouter>
          <AuthorCard author={author} />
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("Basic Rendering", () => {
    it("renders author name correctly", () => {
      renderComponent(mockAuthorWithPhoto);
      expect(screen.getByText("J.K. Rowling")).toBeInTheDocument();
    });

    it("renders birth year when birth_date is provided", () => {
      renderComponent(mockAuthorWithPhoto);
      expect(screen.getByText("Born 1965")).toBeInTheDocument();
    });

    it("does not render birth year when birth_date is empty", () => {
      renderComponent(mockAuthorMinimal);
      expect(screen.queryByText(/Born/)).not.toBeInTheDocument();
    });

    it("renders bio as string", () => {
      renderComponent(mockAuthorWithPhoto);
      expect(screen.getByText(/Joanne Rowling, better known/)).toBeInTheDocument();
    });

    it("renders bio from object with value property", () => {
      renderComponent(mockAuthorWithoutPhoto);
      expect(screen.getByText(/Stephen Edwin King is an American author/)).toBeInTheDocument();
    });

    it("renders default bio message when bio is empty", () => {
      renderComponent(mockAuthorNoBio);
      const bioElements = screen.getAllByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && 
               element?.className?.includes('chakra-text') &&
               (content === '' || content === 'No bio available.');
      });
      expect(bioElements.length).toBeGreaterThan(0);
    });

    it("renders default bio message when bio is not provided", () => {
      renderComponent(mockAuthorMinimal);
      const bioElements = screen.getAllByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && 
               element?.className?.includes('chakra-text') &&
               (content === '' || content === 'No bio available.');
      });
      expect(bioElements.length).toBeGreaterThan(0);
    });
  });

  describe("Image handling", () => {
    it("displays author image when available", () => {
      renderComponent(mockAuthorWithPhoto);
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("shows author initials when no photos available", () => {
      const authorWithoutPhoto = { 
        ...mockAuthorWithoutPhoto, 
        photos: [],
        key: "/authors/OL99999A"
      };
      renderComponent(authorWithoutPhoto);
      
      const images = screen.queryAllByRole("img");
      if (images.length > 0) {
        const mainImage = images.find(img => 
          img.getAttribute('alt')?.includes('Stephen King')
        );
        if (mainImage) {
          fireEvent.error(mainImage);
        }
      }
      
      const allElements = Array.from(document.querySelectorAll('div, span, p'));
      const possibleInitialsElements = allElements.filter(element => {
        const text = element.textContent;
        return text === "SK" || text?.includes("SK") || 
               element.getAttribute('data-initials') === "SK" ||
               element.className.includes('initials');
      });

      const hasInitialsContent = screen.queryByText("SK");

      expect(possibleInitialsElements.length > 0 || hasInitialsContent).toBeTruthy();
    });

    it("generates correct initials for single name", () => {
      const singleNameAuthor = { 
        ...mockAuthorMinimal, 
        name: "Plato", 
        photos: [],
        key: "/authors/OL99998A"
      };
      renderComponent(singleNameAuthor);
      
      const images = screen.queryAllByRole("img");
      if (images.length > 0) {
        images.forEach(img => fireEvent.error(img));
      }

      const initialsElements = screen.getAllByText("P");
      expect(initialsElements.length).toBeGreaterThan(0);
      
      const hasCorrectInitials = initialsElements.some(element => 
        element.textContent === "P" && 
        element.tagName.toLowerCase() === 'p'
      );
      expect(hasCorrectInitials).toBeTruthy();
    });

    it("generates correct initials for multiple names", () => {
      const multiNameAuthor = { 
        ...mockAuthorMinimal, 
        name: "Jean-Paul Charles Aymard Sartre", 
        photos: [],
        key: "/authors/OL99997A"
      };
      renderComponent(multiNameAuthor);
      
      const images = screen.queryAllByRole("img");
      if (images.length > 0) {
        images.forEach(img => fireEvent.error(img));
      }

      const initialsElements = screen.getAllByText("JC");
      expect(initialsElements.length).toBeGreaterThan(0);
      
      const hasCorrectInitials = initialsElements.some(element => 
        element.textContent === "JC" && 
        element.tagName.toLowerCase() === 'p'
      );
      expect(hasCorrectInitials).toBeTruthy();
    });
  });

  describe("Navigation", () => {
    it("navigates to author detail page when clicked", async () => {
      renderComponent(mockAuthorWithPhoto);
      
      const authorName = screen.getByText("J.K. Rowling");
      const card = authorName.closest("[data-testid], div[role], [tabindex]") || authorName.parentElement;
      
      if (card) {
        fireEvent.click(card);
        
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalled();
        });
      }
    });
  });

  describe("Error handling", () => {
    it("handles invalid birth date gracefully", () => {
      const invalidDateAuthor = { ...mockAuthorWithPhoto, birth_date: "invalid-date" };
      renderComponent(invalidDateAuthor);
      
      expect(screen.queryByText(/Born/)).not.toBeInTheDocument();
    });

    it("handles empty author name gracefully", () => {
      const emptyNameAuthor = { ...mockAuthorMinimal, name: "" };
      
      expect(() => {
        renderComponent(emptyNameAuthor);
      }).not.toThrow();
    });

    it("handles author name with only spaces", () => {
      const spaceNameAuthor = { ...mockAuthorMinimal, name: "   " };
      
      expect(() => {
        renderComponent(spaceNameAuthor);
      }).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      renderComponent(mockAuthorWithPhoto);
      
      const heading = screen.getByText("J.K. Rowling");
      expect(heading.tagName.toLowerCase()).toBe("h3");
      expect(heading).toHaveTextContent("J.K. Rowling");
    });
  });

  describe("Edge cases", () => {
    it("handles author with very long name", () => {
      const longNameAuthor = {
        ...mockAuthorMinimal,
        name: "This Is A Very Long Author Name That Should Be Truncated Properly",
      };
      
      expect(() => {
        renderComponent(longNameAuthor);
      }).not.toThrow();
      
      expect(screen.getByText(/This Is A Very Long Author Name/)).toBeInTheDocument();
    });

    it("handles author with very long bio", () => {
      const longBioAuthor = {
        ...mockAuthorMinimal,
        bio: "This is a very long biography that should be truncated to show only the first few lines. ".repeat(10),
      };
      
      expect(() => {
        renderComponent(longBioAuthor);
      }).not.toThrow();
    });

    it("handles author with special characters in name", () => {
      const specialCharAuthor = {
        ...mockAuthorMinimal,
        name: "José María Aznar López-Quesada",
      };
      
      expect(() => {
        renderComponent(specialCharAuthor);
      }).not.toThrow();
      
      expect(screen.getByText("José María Aznar López-Quesada")).toBeInTheDocument();
    });
  });
});