import React from "react";
import { Routes, Route } from "react-router-dom";
import Books from "./components/Books";
import BookDetails from "./components/BookDetails";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<Books />} />
      <Route path="/books/:bookId" element={<BookDetails />} />
    </Routes>
  );
};

export default App;
