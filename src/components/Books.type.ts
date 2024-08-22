export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  language?: string[];
  cover_i?: number;
}

export interface OpenLibraryBookDetails {
  title: string;
  authors: { name: string }[];
  description?: {
    value: string;
  };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  number_of_pages?: number;
}

export interface Genre {
  id: string;
  name: string;
}
