import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class ResponseAllDto<T> {
  @IsArray()
  @ValidateNested({ each: true })
  readonly data: T[];

  @IsNumber()
  readonly totalCount: number;

  @IsNumber()
  readonly totalPages: number;

  @IsNumber()
  readonly page: number;

  @IsNumber()
  readonly limit: number;
}
