import { Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import Books from "./components/Books/Books";
import { BookPage } from "./components/BookDetails/BookPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

function App() {
  return (
    <ChakraProvider>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <NavBar />
        <Box as="main" flex="1" p={4}>
          <Routes>
            <Route path="/books/:bookKey" element={<BookPage />} />
            <Route path="/books" element={<Books />} />
            <Route path="/" element={<Navigate replace to="/books" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
