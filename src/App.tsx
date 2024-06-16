import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Books from "./components/Books";
import BookDetails from "./components/BookDetails";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const isStorybook = !!process.env.STORYBOOK;
  return (
    <QueryClientProvider client={queryClient}>
      {isStorybook ? (
        <>
          <Books />
          {/* You can add other components for Storybook preview here */}
        </>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Books />} />
            <Route path="/books/:bookId" element={<BookDetails />} />
            <Route path="*" element={<Books />} />
          </Routes>
        </BrowserRouter>
      )}
    </QueryClientProvider>
  );
};

export default App;
