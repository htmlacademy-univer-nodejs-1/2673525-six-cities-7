import { ClassConstructor, plainToInstance, } from 'class-transformer';

export function fillDTO<T>(
  dto: ClassConstructor<T>,
  plainObjects: object[]
): T[];

export function fillDTO<T>(
  dto: ClassConstructor<T>,
  plainObject: object
): T;

export function fillDTO<T>(
  dto: ClassConstructor<T>,
  plainObject: object | object[]
): T | T[] {
  return plainToInstance(dto, plainObject, {
    excludeExtraneousValues: true,
  });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}
