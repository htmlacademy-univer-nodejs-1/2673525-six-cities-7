import { Expose } from 'class-transformer';
import {
  City,
  HousingType,
} from '../../../types/index.js';

export class OfferPreviewRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public price!: number;

  @Expose()
  public housingType!: HousingType;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public date!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewUrl!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;
}
