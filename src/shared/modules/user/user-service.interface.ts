import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ChangeFavoriteDto } from './dto/change-favorite.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmailWithPassword(email: string): Promise<DocumentType<UserEntity> | null>;

  addFavorite(userId: string, dto: ChangeFavoriteDto): Promise<DocumentType<UserEntity> | null>;
  removeFavorite(userId: string, dto: ChangeFavoriteDto): Promise<DocumentType<UserEntity> | null>;
  findFavoriteIds(userId: string): Promise<string[] | null>;
  removeOfferFromFavorites(offerId: string): Promise<number>;
}
