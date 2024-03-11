import { ApiProperty } from '@nestjs/swagger';
import { LocalizedString } from '../../../shared/domain/localized-string';

export class SingleItemCategoryDto {
  @ApiProperty({
    description: 'ID of the category',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Localized name of the category',
    type: 'object',
  })
  name: LocalizedString;
}
