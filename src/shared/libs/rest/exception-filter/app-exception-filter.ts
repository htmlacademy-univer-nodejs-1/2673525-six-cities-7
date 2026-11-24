import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../logger/index.js';
import { Component } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/index.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  private handleHttpError(
    error: HttpError,
    res: Response
  ): void {
    const context = error.detail ?? 'HTTP request';

    this.logger.error(
      `[${context}]: ${error.httpStatusCode} — ${error.message}`,
      error
    );

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error.message));
  }

  private handleOtherError(error: Error, res: Response) {
    this.logger.error(error.message, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject('Internal server error'));
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) {
      next(error);
      return;
    }

    if (error instanceof HttpError) {
      this.handleHttpError(error, res);
      return;
    }

    const serverError = error instanceof Error
      ? error
      : new Error(String(error));

    this.handleOtherError(serverError, res);
  }
}
