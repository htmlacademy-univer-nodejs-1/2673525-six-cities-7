import { User } from './user.type.js';

export type Comment = {
  text: string;
  author: User;
  publicationDate: string;
  rating: number;
}
