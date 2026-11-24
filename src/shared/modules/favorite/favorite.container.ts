import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { FavoriteController } from './favorite.controller.js';
import { Controller } from '../../libs/rest/index.js';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();
  favoriteContainer.bind<Controller>(Component.FavoriteController).to(FavoriteController).inSingletonScope();

  return favoriteContainer;
}
