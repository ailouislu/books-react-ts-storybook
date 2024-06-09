import React from "react";
import { List, ListItem } from "@chakra-ui/react";

interface ListGroupProps {
  items: any[];
  textProperty: string;
  valueProperty: string;
  selectedItem: any;
  onItemSelect: (item: any) => void;
}

const ListGroup: React.FC<ListGroupProps> = ({
  items,
  textProperty,
  valueProperty,
  selectedItem,
  onItemSelect,
}) => {
  return (
    <List spacing={3}>
      {items.map((item) => (
        <ListItem
          key={item[valueProperty]}
          onClick={() => onItemSelect(item)}
          cursor="pointer"
          p={2}
          bg={item === selectedItem ? "blue.500" : "white"}
          color={item === selectedItem ? "white" : "black"}
          borderRadius="md"
        >
          {item[textProperty]}
        </ListItem>
      ))}
    </List>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "id",
};

export default ListGroup;
