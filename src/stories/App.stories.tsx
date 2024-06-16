import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "../App";
import Books from "../components/Books";
import BookDetails from "../components/BookDetails";

const queryClient = new QueryClient();

export default {
  title: "Components/App",
  component: App,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <Routes>
              <Route path="/" element={<Story />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:bookId" element={<BookDetails />} />
            </Routes>
          </ChakraProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn = (args) => <App {...args} />;

export const Default = Template.bind({});
Default.args = {};
