export interface Book {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    format: string;
    releaseDate: string;
    author: string;
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

  export interface Genre {
    id: string;
    name: string;
  }