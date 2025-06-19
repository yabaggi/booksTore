export interface Book {
  number: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  description: string;
  pages: number;
  cover: string;
}

export interface Character {
  fullName: string;
  nickname: string;
  hogwartsHouse: string;
  interpretedBy: string;
  children: string[];
  image: string;
  birthdate: string;
}

export interface House {
  house: string;
  emoji: string;
  founder: string;
  colors: string[];
  animal: string;
  element: string;
  traits: string[];
}

export interface Spell {
  spell: string;
  use: string;
}

export type Language = 'en' | 'es' | 'fr' | 'pt' | 'it' | 'de';