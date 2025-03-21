import axios from 'axios';
import { Book } from '../components/Books.type';

const BASE_URL = 'https://openlibrary.org/subjects';

export async function getBooksByGenre(genre: string): Promise<Book[]> {
  try {
    const response = await axios.get(`${BASE_URL}/${genre}.json`);
    const books = response.data.works.map((work: any) => ({
      id: work.key,
      title: work.title,
      author: work.authors.map((author: any) => author.name).join(', '),
      type: genre,
    }));
    return books.slice(0, 6);
  } catch (error) {
    console.error(`Error fetching books for genre ${genre}:`, error);
    return [];
  }
}