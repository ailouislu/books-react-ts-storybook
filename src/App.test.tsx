import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import axios, { AxiosError } from 'axios';

jest.mock("axios");

beforeAll(() => {
  global.window.matchMedia =
    global.window.matchMedia ||
    (() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

  (axios as any).isAxiosError = (error: any): error is AxiosError => {
    return error.isAxiosError === true;
  };
});

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Books component at '/' route", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        works: [
          {
            key: "/works/OL1W",
            title: "Test Book 1",
            author_name: ["Author 1"],
          },
          {
            key: "/works/OL2W",
            title: "Test Book 2",
            author_name: ["Author 2"],
          },
        ],
      },
    });

    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(await screen.findByText("Books")).toBeInTheDocument();
  });
});
