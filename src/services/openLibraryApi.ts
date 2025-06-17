import { Book, Author, BookDetails, SearchResponse } from '../types/book';

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b';

export class OpenLibraryAPI {
  static async searchBooks(query: string, limit = 20, offset = 0): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      fields: 'key,title,author_name,author_key,first_publish_year,isbn,cover_i,subject,publisher,language,number_of_pages_median,ratings_average,ratings_count,want_to_read_count,currently_reading_count,already_read_count'
    });

    const response = await fetch(`${BASE_URL}/search.json?${params}`);
    if (!response.ok) throw new Error('Failed to search books');
    return response.json();
  }

  static async getBooksBySubject(subject: string, limit = 20, offset = 0): Promise<SearchResponse> {
    const params = new URLSearchParams({
      subject: subject,
      limit: limit.toString(),
      offset: offset.toString(),
      fields: 'key,title,author_name,author_key,first_publish_year,isbn,cover_i,subject,publisher,language,number_of_pages_median,ratings_average,ratings_count'
    });

    const response = await fetch(`${BASE_URL}/search.json?${params}`);
    if (!response.ok) throw new Error('Failed to fetch books by subject');
    return response.json();
  }

  static async getBookDetails(key: string): Promise<BookDetails> {
    const response = await fetch(`${BASE_URL}${key}.json`);
    if (!response.ok) throw new Error('Failed to fetch book details');
    return response.json();
  }

  static async getAuthor(key: string): Promise<Author> {
    const response = await fetch(`${BASE_URL}${key}.json`);
    if (!response.ok) throw new Error('Failed to fetch author');
    return response.json();
  }

  static async getAuthorWorks(authorKey: string, limit = 50): Promise<{ entries: any[] }> {
    const params = new URLSearchParams({
      limit: limit.toString()
    });

    const response = await fetch(`${BASE_URL}/authors/${authorKey}/works.json?${params}`);
    if (!response.ok) throw new Error('Failed to fetch author works');
    return response.json();
  }

  static getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `${COVERS_URL}/id/${coverId}-${size}.jpg`;
  }

  static getAuthorPhotoUrl(photoId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `${COVERS_URL}/a/id/${photoId}-${size}.jpg`;
  }

  static async getTrendingBooks(): Promise<Book[]> {
    // Get trending books by searching for recent popular titles
    const currentYear = new Date().getFullYear();
    const response = await this.searchBooks(`first_publish_year:${currentYear - 1} OR first_publish_year:${currentYear}`, 20);
    return response.docs.filter(book => book.cover_i && book.ratings_count && book.ratings_count > 10);
  }

  static async getPopularGenres(): Promise<string[]> {
    return [
      'fiction',
      'fantasy',
      'science_fiction',
      'mystery',
      'romance',
      'thriller',
      'biography',
      'history',
      'philosophy',
      'poetry',
      'drama',
      'horror',
      'adventure',
      'young_adult',
      'children',
      'self_help',
      'business',
      'psychology',
      'art',
      'cooking'
    ];
  }
}