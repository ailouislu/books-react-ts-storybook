export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  language?: string[];
  cover_i?: number;
}

export interface OpenLibraryBookDetails {
  title: string;
  authors: {
    author: {
      key: string;
      name: string;
      authorId?: string;
    };
  }[];
  description?:
    | {
        value: string;
      }
    | string;
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  number_of_pages?: number;
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  format: string;
  releaseDate: string;
  author: string;
  authorId?: string;
  price: number;
  publisherRRP: number;
  pages: number;
  description: string;
  dimensions: string;
  wishList: boolean;
  bestSeller: boolean;
  isbn: string;
  publisher: string;
}

export interface Author {
  key: string;
  name: string;
  photos: string[];
  birth_date: string;
  bio: string | { value: string };
}

export interface Genre {
  id: string;
  name: string;
}