import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthorDetails } from "./AuthorDetails";

const meta: Meta<typeof AuthorDetails> = {
  title: "Components/AuthorDetails",
  component: AuthorDetails,
  decorators: [
    (Story) => (
      <ChakraProvider>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AuthorDetails>;

const AuthorDetailsWrapper: React.FC<{ authorId: string }> = ({ authorId }) => (
  <MemoryRouter initialEntries={[`/author/${authorId}`]}>
    <Routes>
      <Route path="/author/:authorId" element={<AuthorDetails />} />
    </Routes>
  </MemoryRouter>
);

export const ExampleAuthor: Story = {
  render: () => <AuthorDetailsWrapper authorId="OL23919A" />,
};
