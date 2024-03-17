import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ValidationErrorMessage } from '../../../shared/validation/validation-error-message';

export class IncreaseUserTicketBalanceDto {
  @ApiProperty({
    description: 'ID of the ticket type',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  @IsString({ message: ValidationErrorMessage.MustBeString })
  ticketTypeId!: string;

  @ApiProperty({
    description: 'Quantity must be added',
    type: Number,
    required: true,
  })
  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  @IsInt({ message: ValidationErrorMessage.MustBeInteger })
  @IsPositive({ message: ValidationErrorMessage.MustBeGreaterThanZero })
  quantity!: number;
}
