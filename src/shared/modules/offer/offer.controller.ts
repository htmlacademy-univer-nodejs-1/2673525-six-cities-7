import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { OfferManagementService } from './offer-management/offer-management-service.interface.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { DocumentType, isDocument } from '@typegoose/typegoose';
import { OfferEntity } from './index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.OfferManagementService) private readonly offerManagementService: OfferManagementService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.premium, });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show, });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Put, handler: this.update, });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const limit = typeof req.query.limit === 'string'
      ? Number(req.query.limit)
      : undefined;

    const offers = await this.offerService.find(limit);

    const responseData = fillDTO(
      OfferPreviewRdo,
      offers.map((offer) => this.toOfferResponseData(offer))
    );

    this.ok(res, responseData);
  }

  public async create(
    req: Request,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.create(req.body as CreateOfferDto);

    await offer.populate('author');

    const responseData = fillDTO(
      OfferRdo,
      this.toOfferResponseData(offer)
    );

    this.created(res, responseData);
  }

  public async show(req: Request, res: Response): Promise<void> {
    const offerId = req.params.offerId as string;
    const offer = await this.findOfferOrFail(offerId);
    const responseData = fillDTO(
      OfferRdo,
      this.toOfferResponseData(offer)
    );
    this.ok(res, responseData);
  }

  public async premium(req: Request, res: Response): Promise<void> {
    const city = req.params.city as City;
    const offers = await this.offerService.findPremiumByCity(city);
    const responseData = fillDTO(
      OfferPreviewRdo,
      offers.map((offer) => this.toOfferResponseData(offer))
    );
    this.ok(res, responseData);
  }

  public async update(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = this.getCurrentUserId(res);
    const offerId = req.params.offerId as string;
    const existingOffer = await this.findOfferOrFail(offerId);
    this.checkOfferOwner(existingOffer, userId);
    const updatedOffer = await this.offerService.updateById(
      offerId,
      req.body as UpdateOfferDto
    );

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND, `Offer not found: ${offerId}`,
        'OfferController'
      );
    }

    const responseData = fillDTO(
      OfferRdo,
      this.toOfferResponseData(updatedOffer)
    );

    this.ok(res, responseData);
  }

  public async delete(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = this.getCurrentUserId(res);
    const offerId = req.params.offerId as string;

    const offer = await this.findOfferOrFail(offerId);

    this.checkOfferOwner(offer, userId);

    await this.offerManagementService.delete(
      offerId,
      userId
    );

    this.noContent(res);
  }

  private async findOfferOrFail(
    offerId: string
  ): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer not found: ${offerId}`,
        'OfferController'
      );
    }

    return offer;
  }

  private toOfferResponseData(
    offer: DocumentType<OfferEntity>
  ) {
    return {
      ...offer.toObject({ virtuals: true }),
      id: offer._id.toString(),
      isFavorite: false,
    };
  }

  private getCurrentUserId(res: Response): string {
    const userId: unknown = res.locals.userId;

    if (typeof userId !== 'string' || userId.length === 0) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Authentication required',
        'OfferController'
      );
    }

    return userId;
  }

  private checkOfferOwner(
    offer: DocumentType<OfferEntity>,
    userId: string
  ): void {
    const author = offer.author;

    if (!author) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Offer has no existing author',
        'OfferController'
      );
    }

    const authorId = isDocument(author)
      ? author._id.toString()
      : author.toString();

    if (authorId !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Only the author can modify this offer',
        'OfferController'
      );
    }
  }
}
