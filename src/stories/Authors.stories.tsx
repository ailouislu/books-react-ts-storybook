import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Authors from "../components/Authors/Authors";

const queryClient = new QueryClient();

export default {
  title: "Components/Authors",
  component: Authors,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/authors/fiction"]}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <Routes>
              <Route path="/authors/:subject" element={<Story />} />
            </Routes>
          </ChakraProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn = () => <Authors subject="fiction" />;

export const FictionAuthors = Template.bind({});
FictionAuthors.args = {};
