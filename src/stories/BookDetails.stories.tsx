import { StoryFn, Meta } from "@storybook/react";
import { BookDetails } from "../components/BookDetails";
import { ChakraProvider } from "@chakra-ui/react";

export default {
  title: "Components/BookDetails",
  component: BookDetails,
  decorators: [
    (Story) => (
      <ChakraProvider>
        <Story />
      </ChakraProvider>
    ),
  ],
} as Meta;

const Template: StoryFn<{ bookKey: string }> = (args) => (
  <BookDetails {...args} />
);

export const FetchFromAPI = Template.bind({});
FetchFromAPI.args = {
  bookKey: "/works/OL45804W",
};
