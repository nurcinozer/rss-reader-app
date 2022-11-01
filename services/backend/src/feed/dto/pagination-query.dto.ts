import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  page!: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  size!: number;
}
