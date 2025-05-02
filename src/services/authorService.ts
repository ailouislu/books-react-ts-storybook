import axios from 'axios';
import {
  OpenLibrarySearchResponse,
  OpenLibraryBook,
  Author
} from '../components/Books.type';

const SEARCH_URL = 'https://openlibrary.org/search.json';

export async function getAuthorsBySubject(
  subject: string,
  limit: number = 9,
  page: number = 1
): Promise<{ authors: Author[]; total: number }> {
  const resp = await axios.get<OpenLibrarySearchResponse>(SEARCH_URL, {
    params: {
      subject,
      fields: 'author_key,author_name',
      limit,
      page
    }
  });
  const docs: OpenLibraryBook[] = Array.isArray(resp.data.docs) ? resp.data.docs : [];
  const map = new Map<string, string>();
  docs.forEach(doc => {
    (doc.author_key || []).forEach((key, i) => {
      const name = doc.author_name?.[i];
      if (key && name && !map.has(key)) {
        map.set(key, name);
      }
    });
  });
  const authors: Author[] = Array.from(map.entries()).map(([key, name]) => ({
    key,
    name,
    photos: [],
    birth_date: '',
    bio: ''
  }));
  return { authors, total: resp.data.numFound };
}
