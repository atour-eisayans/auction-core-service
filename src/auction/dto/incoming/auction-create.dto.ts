import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuctionState } from '../../../shared/enum/auction-state.enum';
import { Locale } from '../../../shared/enum/locale.enum';
import { ObjectIsAuctionRules } from '../../../shared/validation/decorators/auction-limits-object.decorator';
import { ObjectIsLocalizedString } from '../../../shared/validation/decorators/localized-string.decorator';
import { ValidationErrorMessage } from '../../../shared/validation/validation-error-message';
import { CreateAuctionRequest } from '../../auction.service';
import { AuctionLimit } from '../../domain/auction';

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
