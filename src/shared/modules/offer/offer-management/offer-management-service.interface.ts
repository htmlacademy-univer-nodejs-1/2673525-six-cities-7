import { DocumentType } from '@typegoose/typegoose';
import { ChangeFavoriteDto } from '../../user/index.js';
import { OfferEntity } from '../index.js';

export interface OfferManagementService {
  delete(id: string, userId: string): Promise<void>;

  addFavorite(
    userId: string,
    dto: ChangeFavoriteDto
  ): Promise<void>;

  removeFavorite(
    userId: string,
    dto: ChangeFavoriteDto
  ): Promise<void>;

  findFavorites(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]>;
}
