import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { BookPage } from "../components/BookDetails/BookPage";

const meta: Meta<typeof BookPage> = {
  title: "Components/BookPage",
  component: BookPage,
  decorators: [
    (Story) => (
      <ChakraProvider>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BookPage>;

const BookPageWrapper: React.FC<{ bookKey: string }> = ({ bookKey }) => (
  <MemoryRouter initialEntries={[`/book/${bookKey}`]}>
    <Routes>
      <Route path="/book/:bookKey" element={<BookPage />} />
    </Routes>
  </MemoryRouter>
);

export const FantasticMrFox: Story = {
  render: () => <BookPageWrapper bookKey="OL45804W" />,
};

export const HarryPotter: Story = {
  render: () => <BookPageWrapper bookKey="OL82586W" />,
};

export const PrideAndPrejudice: Story = {
  render: () => <BookPageWrapper bookKey="OL1394864W" />,
};
