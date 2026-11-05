import { City, HousingType, Goods, Location, } from '../../../types/index.js';

export class UpdateOfferDto {
  public title!: string;
  public description!: string;
  public city!: City;
  public previewUrl!: string;
  public imagesUrl!: string[];
  public isPremium!: boolean;
  public housingType!: HousingType;
  public roomCount!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: Goods[];
  public location!: Location;
}
