import { ApiProperty } from '@nestjs/swagger';
import { LocalizedString } from '../../../shared/domain/localized-string';
import { TicketConfigurationDto } from '../../../ticket-configuration/dto/outgoing/ticket-configuration.dto';
import { SingleItemCategoryDto } from './single-item-category.dto';

export class SingleItemDto {
  @ApiProperty({
    description: 'ID of the item',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Name of the item',
    type: 'object',
  })
  name: LocalizedString;

  @ApiProperty({
    description: 'Unit price of the item',
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: 'Currency of the item',
    type: TicketConfigurationDto,
  })
  ticketConfiguration: TicketConfigurationDto;

  @ApiProperty({
    description: 'Category of the item',
    type: SingleItemCategoryDto,
  })
  category: SingleItemCategoryDto;
}
