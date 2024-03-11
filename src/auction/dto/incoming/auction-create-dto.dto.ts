import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ValidationErrorMessage } from '../../../shared/validation/validation-error-message';
import { Locale } from '../../../shared/enum/locale.enum';
import { AuctionState } from '../../../shared/enum/auction-state.enum';
import { AuctionLimit } from '../../../auction/domain/auction';
import { CreateAuctionRequest } from '../../../auction/auction.service';
import { ObjectIsLocalizedString } from '../../../shared/validation/decorators/localized-string.decorator';
import { ObjectIsAuctionRules } from 'src/shared/validation/decorators/auction-limits-object.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class AuctionCreateDto implements CreateAuctionRequest {
  @ApiProperty({
    description: 'Localized name of the auction',
    type: 'object',
  })
  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  @ObjectIsLocalizedString({
    message: ValidationErrorMessage.MustBeValidLocalized,
  })
  name!: Record<Locale, string>;

  @ApiProperty({
    description: 'Start date of the auction',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate({ message: ValidationErrorMessage.MustBeDate })
  startAt?: Date;

  @ApiProperty({
    description: 'State of the auction',
    enum: AuctionState,
  })
  @IsEnum(AuctionState, {
    message: ValidationErrorMessage.MustBeValidAuctionState,
  })
  state: AuctionState = AuctionState.Scheduled;

  @ApiProperty({
    description: 'Rules of an auction',
    type: 'object',
  })
  @IsOptional()
  @ObjectIsAuctionRules({
    message: ValidationErrorMessage.MustBeValidAuctionRules,
  })
  limits?: AuctionLimit;

  @ApiProperty({
    description: 'ID of the item in the auction',
    type: String,
  })
  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  @IsString({ message: ValidationErrorMessage.MustBeString })
  itemId!: string;
}
