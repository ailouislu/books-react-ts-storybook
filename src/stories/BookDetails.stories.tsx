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

export const MrFox = Template.bind({});
MrFox.args = {
  bookKey: "/works/OL45804W",
};

export const HarryPotter = Template.bind({});
HarryPotter.args = {
  bookKey: "/works/OL82586W",
};

export const GoodOmens = Template.bind({});
GoodOmens.args = {
  bookKey: "/works/OL27877W",
};

export const AmericanGods = Template.bind({});
AmericanGods.args = {
  bookKey: "/works/OL7826036W",
};

export const PrideAndPrejudice = Template.bind({});
PrideAndPrejudice.args = {
  bookKey: "/works/OL1394864W",
};

export const GoodWives = Template.bind({});
GoodWives.args = {
  bookKey: "/works/OL17860744W",
};

export const TheGunsOfAugust = Template.bind({});
TheGunsOfAugust.args = {
  bookKey: "/works/OL59419W",
};

export const SugarAndSpice = Template.bind({});
SugarAndSpice.args = {
  bookKey: "/works/OL20631421W",
};
