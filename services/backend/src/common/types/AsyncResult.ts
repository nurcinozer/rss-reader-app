import { Result } from './Result';

export type AsyncResult<T> = Promise<Result<T>>;
