import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { City } from '../../types/index.js';
import { UpdateOfferDto, UpdateOfferStatsDto } from './index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findByIds(ids: string[]): Promise<DocumentType<OfferEntity>[]>;
  find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  exists(id: string): Promise<boolean>;
  updateStats(id: string, dto: UpdateOfferStatsDto): Promise<DocumentType<OfferEntity> | null>;
}
