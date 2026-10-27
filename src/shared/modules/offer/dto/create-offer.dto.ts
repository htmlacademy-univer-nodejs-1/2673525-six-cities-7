import { City, HousingType, Goods, Location } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public date!: Date;
  public city!: City;
  public previewUrl!: string;
  public imagesUrl!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public housingType!: HousingType;
  public roomCount!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: Goods[];
  public author!: string;
  public location!: Location;
}
