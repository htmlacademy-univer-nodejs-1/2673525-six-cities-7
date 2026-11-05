import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from '../offer/index.js';

const COMMENT_LIMIT = 50;

type OfferCommentStats = {
  commentsCount: number;
  rating: number;
};

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) { }

  public async create(
    dto: CreateCommentDto
  ): Promise<DocumentType<CommentEntity>> {
    const offerExists = await this.offerService.exists(dto.offer);

    if (!offerExists) {
      throw new Error(`Offer not found: ${dto.offer}`);
    }

    const comment = await this.commentModel.create(dto);

    await this.updateOfferStats(dto.offer);
    await comment.populate('author');

    this.logger.info(
      `New comment created for offer: ${dto.offer}`
    );

    return comment;
  }

  public async findByOfferId(
    offerId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offer: offerId })
      .sort({ publicationDate: -1, _id: -1 })
      .limit(COMMENT_LIMIT)
      .populate('author')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offer: offerId })
      .exec();

    return result.deletedCount;
  }

  private async updateOfferStats(offerId: string): Promise<void> {
    const [stats] = await this.commentModel
      .aggregate<OfferCommentStats>([
        {
          $match: {
            offer: new Types.ObjectId(offerId),
          },
        },
        {
          $group: {
            _id: null,
            commentsCount: { $sum: 1 },
            rating: { $avg: '$rating' },
          },
        },
      ])
      .exec();

    const result = await this.offerService.updateStats(offerId, {
      commentsCount: stats?.commentsCount ?? 0,
      rating: stats
        ? Math.round(stats.rating * 10) / 10
        : 0,
    });

    if (!result) {
      throw new Error(
        `Cannot update statistics: offer not found: ${offerId}`
      );
    }
  }
}
