import axios from 'axios';
import { Book } from '../components/Books.type';

const BASE_URL = 'https://openlibrary.org/subjects';

export const genreNames = [
  { id: "popular", name: "Popular" },
  { id: "fiction", name: "Fiction" },
  { id: "non-fiction", name: "Non-fiction" },
  { id: "kids", name: "Kid's" },
  { id: "teen", name: "Teen" },
];

export async function getBooksByGenre(genre: string): Promise<Book[]> {
  try {
    const response = await axios.get(`${BASE_URL}/${genre}.json`);
    
    if (!response.data || !response.data.works || !Array.isArray(response.data.works)) {
      console.warn(`Invalid data structure for genre ${genre}:`, response.data);
      return [];
    }
    
    const books = response.data.works.map((work: any) => ({
      id: work.key,
      title: work.title,
      author: Array.isArray(work.authors) 
        ? work.authors.map((author: any) => author.name).join(', ')
        : 'Unknown Author',
      type: genre,
    }));
    
    return books.slice(0, 6);
  } catch (error) {
    console.error(`Error fetching books for genre ${genre}:`, error);
    return [];
  }
}