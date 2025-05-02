import { Routes, Route, Navigate, NavLink, useParams } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Spacer,
  Button,
  Container,
  Link,
  Image,
} from "@chakra-ui/react";
import Books from "./components/Books/Books";
import { BookPage } from "./components/BookDetails/BookPage";
import { AuthorDetails } from "./components/AuthorDetails/AuthorDetails";
import NotFound from "./components/NotFound";
import Authors from "./components/Authors/Authors";

const CustomNavBar: React.FC = () => {
  const handleLink = () => {
    const windowLink = window.open("about:blank");
    if (windowLink) {
      windowLink.location.href = "https://nzlouis.com";
    }
  };
  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={1000}
      bg="teal.600"
      boxShadow="sm"
    >
      <Container maxW="1250px" display="flex" alignItems="center" py={3}>
        <Link onClick={handleLink} cursor="pointer" mr={8}>
          <Image
            src={require("./images/nzlouis.jpg")}
            alt="NZLouis.com"
            width="100px"
            height="30px"
          />
        </Link>
        <Button
          as={NavLink}
          to="/books"
          variant="ghost"
          color="white"
          fontSize="lg"
          _activeLink={{ bg: "teal.700" }}
          end
        >
          Books
        </Button>
        <Button
          as={NavLink}
          to="/authors/subject/popular"
          variant="ghost"
          color="white"
          fontSize="lg"
          _activeLink={{ bg: "teal.700" }}
        >
          Authors
        </Button>
        <Spacer />
      </Container>
    </Box>
  );
};

export const AuthorsPage: React.FC = () => {
  const { subject } = useParams<{ subject?: string }>();
  return <Authors subject={subject || "popular"} />;
};

function App() {
  return (
    <ChakraProvider>
      <CustomNavBar />
      <Box as="main" flex="1" py={6}>
        <Container maxW="1250px">
          <Routes>
            <Route path="/books/:bookKey" element={<BookPage />} />
            <Route path="/books" element={<Books />} />
            <Route path="/authors/:authorId" element={<AuthorDetails />} />
            <Route
              path="/authors"
              element={<Navigate replace to="/authors/subject/popular" />}
            />
            <Route path="/authors/subject/:subject" element={<AuthorsPage />} />
            <Route path="/" element={<Navigate replace to="/books" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
