import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationErrorMessage } from '../../../shared/validation/validation-error-message';

export class GetUserTicketBalanceDto {
  @ApiProperty({
    description: 'ID of the ticket type',
    type: String,
    required: true,
  })
  @IsString({ message: ValidationErrorMessage.MustBeString })
  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  ticketTypeId!: string;
}
