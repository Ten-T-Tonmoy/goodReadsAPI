// all interfaces shii here
export type bookType =
  | "poetry"
  | "drama"
  | "fiction"
  | "horror"
  | "nonFiction"
  | "academic"
  | "biography"
  | "children"
  | "youngAdult";

export interface Book {
  id: string;
  title: string;
  description: string;
  bookType: bookType;
  genre: string[];
  keywords: string[];
  coverPhoto?: string;
  publisher?: string;
  availableStores?: string[];
  ratingSum: number;
  ratingNumber: number;
  createdAt: Date;
  bookListId?: string;
  personalRemark?: string;
  authorId?: string;
}

export type authorRole =
  | "poet"
  | "novelist"
  | "dramatist"
  | "philosopher"
  | "scientist"
  | "fictionWriter";
export interface User {
  id: string;
  name: string;
  email?: string;
  region?: string;
  gender: boolean;
  profilePhoto?: string;
  coverPhoto?: string;
  about?: string;
}

export interface Author {
  id: string;
  info: string;
  region: string;
  languageOfBooks: string;
  role: string;
  userId: string;
}

export interface Review {
  id: string;
  bookId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  userId?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  upVotes: number;
  downVotes: number;
  authorId?: string;
}

export interface BookList {
  id: string;
  isPublicList: boolean;
  title: string;
  description?: string;
  coverPhoto?: string;
  userId: string;
  upVotes: number;
  downVotes: number;
  authorId?: string;
}
