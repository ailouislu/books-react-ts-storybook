import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import BookDetails from "../components/BookDetails";

const queryClient = new QueryClient();

export default {
  title: "Components/BookDetails",
  component: BookDetails,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
} as Meta;

const Template: StoryFn = (args) => <BookDetails {...args} />;

export const Default = Template.bind({});
Default.args = {};
