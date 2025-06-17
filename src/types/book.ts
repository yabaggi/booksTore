export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
  publisher?: string[];
  language?: string[];
  number_of_pages_median?: number;
  ratings_average?: number;
  ratings_count?: number;
  want_to_read_count?: number;
  currently_reading_count?: number;
  already_read_count?: number;
}

export interface Author {
  key: string;
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string;
  photos?: number[];
  works_count?: number;
  top_work?: string;
  top_subjects?: string[];
}

export interface BookDetails {
  key: string;
  title: string;
  authors?: Array<{
    author: {
      key: string;
    };
    type: {
      key: string;
    };
  }>;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  publishers?: string[];
  isbn_10?: string[];
  isbn_13?: string[];
  number_of_pages?: number;
  works?: Array<{
    key: string;
  }>;
}

export interface SearchResponse {
  docs: Book[];
  numFound: number;
  start: number;
}