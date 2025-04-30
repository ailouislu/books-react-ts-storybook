import React from "react";
import {
  Box,
  Flex,
  Link,
  Image,
  Container,
  Spacer,
} from "@chakra-ui/react";

const NavBar: React.FC = () => {
  const handleLink = () => {
    const windowLink = window.open('about:blank');
    if (windowLink) {
      windowLink.location.href = "https://nzlouis.com";
    }
  };

  return (
    <Box as="nav" position="sticky" top="0" bg="gray.100" py={4} boxShadow="sm" zIndex="sticky">
      <Container maxW="container.xl">
        <Flex align="center">
          <Link onClick={handleLink} cursor="pointer" mr={8}>
            <Image
              src={require("../images/nzlouis.jpg")}
              alt="NZLouis.com"
              width="100px"
              height="30px"
            />
          </Link>
          <Flex as="ul" listStyleType="none" m={0} p={0} align="center">
            <Box as="li" mr={6}>
              <Link href="/books" _hover={{ textDecoration: "none", color: "blue.500" }}>
                Books
              </Link>
            </Box>
            <Box as="li">
              <Link href="/authors" _hover={{ textDecoration: "none", color: "blue.500" }}>
                Authors
              </Link>
            </Box>
          </Flex>
          <Spacer />
        </Flex>
      </Container>
    </Box>
  );
};

export default NavBar;
