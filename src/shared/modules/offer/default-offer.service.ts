import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { isValidObjectId } from 'mongoose';
import { City, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import {
  CreateOfferDto, OfferEntity, OfferService,
  UpdateOfferDto, UpdateOfferStatsDto
} from './index.js';

const DEFAULT_OFFER_LIMIT = 60;
const PREMIUM_OFFER_LIMIT = 3;

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) { }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title} by ${dto.author}`);
    return result;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(id)
      .populate('author')
      .exec();
  }

  public async findByIds(ids: string[]): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({
        _id: { $in: ids },
      })
      .sort({ date: -1, _id: -1 })
      .exec();
  }

  public async find(limit = DEFAULT_OFFER_LIMIT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ date: -1, _id: -1 })
      .limit(limit)
      .exec();
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ date: -1, _id: -1 })
      .limit(PREMIUM_OFFER_LIMIT)
      .exec();
  }

  public async updateById(
    id: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(
        id,
        { $set: dto },
        { new: true }
      )
      .populate('author')
      .exec();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(id)
      .exec();
  }

  public async exists(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }

    const result = await this.offerModel.exists({ _id: id });
    return result !== null;
  }

  public async updateStats(
    id: string,
    dto: UpdateOfferStatsDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(
        id,
        { $set: dto },
        { new: true }
      )
      .exec();
  }
}
