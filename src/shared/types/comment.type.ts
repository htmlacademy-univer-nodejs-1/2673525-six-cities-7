import { User } from "./user.type";

export type Comment = {
  text: string;
  author: User;
  publicationDate: string;
  rating: number;
}
