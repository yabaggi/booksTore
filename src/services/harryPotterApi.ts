import { Book, Character, House, Spell, Language } from '../types/api';

const BASE_URL = 'https://potterapi-fedeperin.vercel.app';

export class HarryPotterAPI {
  private static language: Language = 'en';

  static setLanguage(lang: Language) {
    this.language = lang;
  }

  static getLanguage(): Language {
    return this.language;
  }

  private static async fetchData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}/${this.language}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    return response.json();
  }

  // Books
  static async getAllBooks(): Promise<Book[]> {
    return this.fetchData<Book[]>('/books');
  }

  static async getRandomBook(): Promise<Book> {
    return this.fetchData<Book>('/books/random');
  }

  // Characters
  static async getAllCharacters(): Promise<Character[]> {
    return this.fetchData<Character[]>('/characters');
  }

  static async getRandomCharacter(): Promise<Character> {
    return this.fetchData<Character>('/characters/random');
  }

  // Houses
  static async getAllHouses(): Promise<House[]> {
    return this.fetchData<House[]>('/houses');
  }

  static async getRandomHouse(): Promise<House> {
    return this.fetchData<House>('/houses/random');
  }

  // Spells
  static async getAllSpells(): Promise<Spell[]> {
    return this.fetchData<Spell[]>('/spells');
  }

  static async getRandomSpell(): Promise<Spell> {
    return this.fetchData<Spell>('/spells/random');
  }
}