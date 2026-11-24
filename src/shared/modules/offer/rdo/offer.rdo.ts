import { Expose, Type } from 'class-transformer';
import { Goods } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';
import { OfferPreviewRdo } from './offer-preview.rdo.js';
import { LocationRdo } from '../../location/index.js';

export class OfferRdo extends OfferPreviewRdo {
  @Expose()
  public description!: string;

  @Expose()
  public imagesUrl!: string[];

  @Expose()
  public roomCount!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public goods!: Goods[];

  @Expose()
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}
