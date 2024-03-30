import { ApiProperty } from '@nestjs/swagger';
import { TicketConfigurationDto } from '../../../ticket-configuration/dto/outgoing/ticket-configuration.dto';

export class UserTicketBalanceDto {
  @ApiProperty({
    description: 'ID of the user ticket balance',
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: 'Balance of the ticket',
    type: Number,
  })
  balance!: number;

  @ApiProperty({
    description: 'Ticket configuration',
    type: TicketConfigurationDto,
  })
  ticketType: TicketConfigurationDto;
}
