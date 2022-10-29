import { Result } from './types';
import { HttpException } from '@nestjs/common';

export function isHttpException(obj: Result<unknown>): obj is HttpException {
  return (obj as HttpException).message !== undefined;
}
