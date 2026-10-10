import { Location } from "./location.type";
import { User } from "./user.type";

export type City = 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';

export type HousingType = 'apartment' | 'house' | 'room' | 'hotel';

export type Goods = 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace'
  | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge';

export type Offer = {
  title: string;
  description: string;
  date: Date;
  city: City;
  previewUrl: string;
  imagesUrl: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomCount: number;
  maxAdults: number;
  price: number;
  goods: Goods[];
  author: User;
  commentsCount: number;
  location: Location;
}
