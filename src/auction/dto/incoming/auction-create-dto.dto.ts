import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationErrorMessage } from 'src/shared/validation/validation-error-message';

export class AuctionCreateDto {
  @IsString({ message: ValidationErrorMessage.MustBeString })
  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  id!: string;

  @IsString({ message: ValidationErrorMessage.MustBeString })
  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  name: string;
}
