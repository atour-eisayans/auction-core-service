import { ApiProperty } from '@nestjs/swagger';
import { SingleCurrencyDto } from 'src/currency/dto/outgoing/single-currency.dto';

export class TicketConfigurationDto {
  @ApiProperty({
    description: 'ID of the configuration',
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: 'Corresponding currency',
    type: SingleCurrencyDto,
  })
  currency: SingleCurrencyDto;

  @ApiProperty({
    description: 'Price of each ticket',
    type: Number,
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Amount when a ticket is placed is raised',
    type: Number,
  })
  raisingAmount: number;
}
