import axios from "axios";
import { Book } from "../components/Books.type";

const BASE_URL = "https://openlibrary.org/subjects";

export const genreNames = [
  { id: "popular", name: "Popular" },
  { id: "fiction", name: "Fiction" },
  { id: "non-fiction", name: "Non-fiction" },
  { id: "kids", name: "Kid's" },
  { id: "teen", name: "Teen" },
];

export async function getBooksByGenre(
  genre: string,
  limit: number = 9,
  offset: number = 0
): Promise<{ books: Book[]; total: number }> {
  try {
    const response = await axios.get(`${BASE_URL}/${genre}.json`, {
      params: { limit, offset },
    });
    const works = response.data?.works;
    if (!Array.isArray(works)) {
      return { books: [], total: 0 };
    }
    const books: Book[] = works.map((work: any) => ({
      id: work.key,
      title: work.title,
      subtitle: work.subtitle || "",
      type: genre,
      format: "Paperback",
      releaseDate: work.first_publish_year?.toString() ?? "Unknown",
      author: Array.isArray(work.authors)
        ? work.authors.map((a: any) => a.name).join(", ")
        : "Unknown Author",
      price: 0,
      publisherRRP: 0,
      pages: work.edition_count || 0,
      description: work.description ?? "",
      dimensions: "",
      wishList: false,
      bestSeller: false,
      isbn:
        Array.isArray(work.isbn) && work.isbn.length > 0 ? work.isbn[0] : "",
      publisher:
        Array.isArray(work.publisher) && work.publisher.length > 0
          ? work.publisher[0]
          : "Unknown",
    }));
    const total = response.data.work_count ?? books.length;
    return { books, total };
  } catch {
    return { books: [], total: 0 };
  }
}
