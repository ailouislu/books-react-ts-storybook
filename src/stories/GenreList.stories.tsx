import React, { useState, useEffect } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import GenreList from "../components/GenreList";
import { useGenresStore } from "../hooks/useGenresData";
import { Genre } from "../components/Books.type";

export default {
  title: "Components/GenreList",
  component: GenreList,
  decorators: [
    (Story) => (
      <ChakraProvider>
        <Story />
      </ChakraProvider>
    ),
  ],
} as Meta;

const GenreListWithData: React.FC = () => {
  const { genres, isLoading, error } = useGenresStore();
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  useEffect(() => {
    if (genres.length > 0) {
      setSelectedGenre({ id: "popular", name: "Popular" });
    }
  }, [genres]);

  if (isLoading) return <div>Loading genres...</div>;
  if (error) return <div>Error loading genres: {error.message}</div>;

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenre(genre);
  };

  return (
    <Box width="400px">
      <GenreList
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
      />
    </Box>
  );
};

const Template: StoryFn = () => <GenreListWithData />;

export const Default = Template.bind({});
Default.args = {};
