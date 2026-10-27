import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import {
  City,
  HousingType,
  Goods,
  Location,
  Offer,
} from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';
import { LocationEntity } from '../location/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps implements Omit<Offer, 'author'> {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true, default: () => new Date() })
  public date!: Date;

  @prop({ required: true, enum: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] })
  public city!: City;

  @prop({ required: true })
  public previewUrl!: string;

  @prop({ required: true, type: () => [String] })
  public imagesUrl!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, enum: ['apartment', 'house', 'room', 'hotel'] })
  public housingType!: HousingType;

  @prop({ required: true })
  public roomCount!: number;

  @prop({ required: true })
  public maxAdults!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true, type: () => [String] })
  public goods!: Goods[];

  @prop({ required: true, ref: UserEntity })
  public author!: Ref<UserEntity>;

  @prop({ required: true, default: 0 })
  public commentsCount!: number;

  @prop({ required: true, type: () => LocationEntity })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
