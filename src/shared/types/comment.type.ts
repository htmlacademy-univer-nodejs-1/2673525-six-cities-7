import { User } from './user.type.js';

export type Comment = {
  text: string;
  author: User;
  publicationDate: Date;
  rating: number;
}
