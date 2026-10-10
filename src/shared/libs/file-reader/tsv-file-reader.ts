import { readFileSync } from 'node:fs';
import { Offer, HousingType, City, Goods, UserType, User, Location } from '../../types/index.js';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, date, city, previewUrl, imagesUrl,
        isPremium, isFavorite, rating, housingType, roomCount, maxAdults, price,
        goods, author, commentsCount, location]) => {
        const [authorName, authorEmail, authorAvatarUrl, authorType] = author.split('|');
        const [latitude, longitude] = location.split('|').map(Number);
        return {
          title,
          description,
          date: new Date(date),
          city: city as City,
          previewUrl,
          imagesUrl: imagesUrl.split('|'),
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: Number.parseFloat(rating),
          housingType: housingType as HousingType,
          roomCount: Number.parseInt(roomCount, 10),
          maxAdults: Number.parseInt(maxAdults, 10),
          price: Number.parseInt(price, 10),
          goods: goods ? (goods.split('|') as Goods[]) : [],
          author: {
            name: authorName,
            email: authorEmail,
            avatarUrl: authorAvatarUrl,
            type: authorType as UserType,
          } as User,
          commentsCount: Number.parseInt(commentsCount, 10),
          location: {
            latitude,
            longitude,
          } as Location,
        } as Offer;
      });
  }
}
