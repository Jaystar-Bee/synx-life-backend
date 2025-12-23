import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max } from 'class-validator';

export class PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(10000)
  perPage: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageNumber: number = 1;
}
