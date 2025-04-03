import { Routes, Route } from "react-router-dom";
import Books from "./components/Books/Books";
import { ChakraProvider } from "@chakra-ui/react";
import { BookPage } from "./components/BookDetails/BookPage";

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/book/:bookKey" element={<BookPage />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
