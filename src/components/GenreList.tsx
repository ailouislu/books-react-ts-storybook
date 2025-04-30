import React from "react";
import { List, ListItem } from "@chakra-ui/react";
import { Genre } from "./Books.type";

export interface GenreListProps {
  genres: Genre[];
  selectedGenre: Genre | null;
  onGenreSelect: (genre: Genre) => void;
}

const GenreList: React.FC<GenreListProps> = ({
  genres,
  selectedGenre,
  onGenreSelect,
}) => {
  const allGenres = [...genres];

  return (
    <List spacing={3}>
      {allGenres.map((genre) => (
        <ListItem
          key={genre.id}
          onClick={() => onGenreSelect(genre)}
          cursor="pointer"
          p={2}
          bg={genre.id === selectedGenre?.id ? "blue.500" : "white"}
          color={genre.id === selectedGenre?.id ? "white" : "black"}
          borderRadius="md"
        >
          {genre.name}
        </ListItem>
      ))}
    </List>
  );
};

export default GenreList;
