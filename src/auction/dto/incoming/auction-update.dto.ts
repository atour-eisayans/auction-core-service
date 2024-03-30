import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { AuctionLimit } from '../../../auction/domain/auction';
import { AuctionState } from '../../../shared/enum/auction-state.enum';
import { Locale } from '../../../shared/enum/locale.enum';
import { ObjectIsAuctionRules } from '../../../shared/validation/decorators/auction-limits-object.decorator';
import { ObjectIsLocalizedString } from '../../../shared/validation/decorators/localized-string.decorator';
import { ValidationErrorMessage } from '../../../shared/validation/validation-error-message';
import { UpdateAuctionRequest } from '../../auction.service';

export class AuctionUpdateDto implements UpdateAuctionRequest {
  @ApiProperty({
    description: 'Name of the auction',
  })
  @ObjectIsLocalizedString({
    message: ValidationErrorMessage.MustBeValidLocalized,
  })
  @IsOptional()
  name?: Record<Locale, string>;

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
  @IsOptional()
  state?: AuctionState = AuctionState.Scheduled;

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
  @IsOptional({ message: ValidationErrorMessage.MustBeFilled })
  @IsString({ message: ValidationErrorMessage.MustBeString })
  itemId?: string;
}
