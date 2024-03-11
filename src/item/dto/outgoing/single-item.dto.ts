import { ApiProperty } from '@nestjs/swagger';
import { SingleCurrencyDto } from '../../../currency/dto/outgoing/single-currency.dto';
import { LocalizedString } from '../../../shared/domain/localized-string';
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
    type: SingleCurrencyDto,
  })
  currency: SingleCurrencyDto;

  @ApiProperty({
    description: 'Category of the item',
    type: SingleItemCategoryDto,
  })
  category: SingleItemCategoryDto;
}
