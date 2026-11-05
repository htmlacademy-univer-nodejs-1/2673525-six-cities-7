import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { Component } from '../../../types/index.js';
import { OfferEntity, OfferManagementService, OfferService } from '../index.js';
import { CommentService } from '../../comment/index.js';
import { ChangeFavoriteDto, UserService } from '../../user/index.js';

@injectable()
export class DefaultOfferManagementService
  implements OfferManagementService {
  constructor(
    @inject(Component.OfferService)
    private readonly offerService: OfferService,

    @inject(Component.CommentService)
    private readonly commentService: CommentService,

    @inject(Component.UserService)
    private readonly userService: UserService,
  ) { }

  public async delete(
    id: string,
    userId: string
  ): Promise<void> {
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new Error(`Offer not found: ${id}`);
    }

    if (!offer.author) {
      throw new Error(`Offer author not found: ${id}`);
    }

    if (offer.author._id.toString() !== userId) {
      throw new Error(
        `Only the author can delete offer: ${id}`
      );
    }

    await this.commentService.deleteByOfferId(id);
    await this.userService.removeOfferFromFavorites(id);

    const deletedOffer = await this.offerService.deleteById(id);

    if (!deletedOffer) {
      throw new Error(
        `Offer disappeared during deletion: ${id}`
      );
    }
  }

  public async addFavorite(
    userId: string,
    dto: ChangeFavoriteDto
  ): Promise<void> {
    const offerExists = await this.offerService.exists(
      dto.offerId
    );

    if (!offerExists) {
      throw new Error(`Offer not found: ${dto.offerId}`);
    }

    const user = await this.userService.addFavorite(userId, dto);

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
  }

  public async removeFavorite(
    userId: string,
    dto: ChangeFavoriteDto
  ): Promise<void> {
    const offerExists = await this.offerService.exists(
      dto.offerId
    );

    if (!offerExists) {
      throw new Error(`Offer not found: ${dto.offerId}`);
    }

    const user = await this.userService.removeFavorite(
      userId,
      dto
    );

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
  }

  public async findFavorites(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const favoriteIds = await this.userService.findFavoriteIds(
      userId
    );

    if (favoriteIds === null) {
      throw new Error(`User not found: ${userId}`);
    }

    if (favoriteIds.length === 0) {
      return [];
    }

    return this.offerService.findByIds(favoriteIds);
  }
}
