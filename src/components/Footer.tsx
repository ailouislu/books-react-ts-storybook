import React from 'react';
import {
  Box,
  Container,
  Flex,
  Text,
  Link,
  List,
  ListItem,
  Spacer,
} from '@chakra-ui/react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.100" py={3}>
      <Container maxW="container.xl">
        <Flex
          flexWrap="wrap"
          justify="space-between"
          align="center"
          py={3}
          my={4}
          borderTop="1px solid"
          borderColor="gray.300"
        >
          <Text flex={{ base: '1', md: 'none' }} mb={{ base: 2, md: 0 }} color="gray.600">
            &copy; {currentYear} NZ Louis
          </Text>

          <Spacer flex={{ base: '1', md: '1' }} />

          <List
            display="flex"
            flex={{ base: '1', md: 'none' }}
            justifyContent={{ base: 'flex-start', md: 'flex-end' }}
            m={0}
            p={0}
            listStyleType="none"
          >
            <ListItem mr={2}>
              <Link href="https://nzlouis.com" target="_blank" rel="noreferrer" color="gray.600" px={2} _hover={{ textDecoration: 'underline' }}>
                Home
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://nzlouis.com" target="_blank" rel="noreferrer" color="gray.600" px={2} _hover={{ textDecoration: 'underline' }}>
                About
              </Link>
            </ListItem>
          </List>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
