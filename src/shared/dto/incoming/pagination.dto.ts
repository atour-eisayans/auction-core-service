import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { ValidationErrorMessage } from '../../validation/validation-error-message';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Page of the list',
    type: Number,
  })
  @Type(() => Number)
  @IsInt({ message: ValidationErrorMessage.MustBeInteger })
  @IsPositive({ message: ValidationErrorMessage.MustBeGreaterThanZero })
  page = 1;

  @ApiProperty({
    description: 'Limit per each page',
    type: Number,
  })
  @Type(() => Number)
  @IsInt({ message: ValidationErrorMessage.MustBeInteger })
  @IsPositive({ message: ValidationErrorMessage.MustBeGreaterThanZero })
  limit = 10;
}
