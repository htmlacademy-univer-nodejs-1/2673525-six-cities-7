import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import {
  DefaultOfferService, OfferEntity,
  OfferModel, OfferService,
  DefaultOfferManagementService, OfferManagementService,
} from './index.js';

export function createOfferContainer() {
  const offerContainer = new Container();
  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<OfferManagementService>(Component.OfferManagementService).to(DefaultOfferManagementService).inSingletonScope();
  return offerContainer;
}
