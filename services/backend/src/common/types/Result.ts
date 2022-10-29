import { HttpException } from '@nestjs/common';

export type Result<T> = T | HttpException;
