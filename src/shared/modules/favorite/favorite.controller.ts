import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: Logger
  ) {
    super(logger);
    this.logger.info('Register routes for FavoriteController...');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index, });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.create, });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, });
  }

  public async index(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Favorites list is not implemented yet',
      'FavoriteController'
    );
  }

  public async create(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Adding to favorites is not implemented yet',
      'FavoriteController'
    );
  }

  public async delete(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Removing from favorites is not implemented yet',
      'FavoriteController'
    );
  }
}
