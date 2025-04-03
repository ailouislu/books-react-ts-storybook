import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Books from "../components/Books/Books";
import { BookPage } from "../components/BookDetails";

const queryClient = new QueryClient();

export default {
  title: "Project/FullApp",
  component: Books,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/books"]}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <Routes>
              <Route path="/books" element={<Story />} />
              <Route path="/books/:bookKey" element={<BookPage />} />
            </Routes>
          </ChakraProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn = () => <Books />;

export const Default = Template.bind({});
Default.args = {};
