import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AuctionLimit } from 'src/auction/domain/auction';
import { AuctionState } from 'src/shared/enum/auction-state.enum';
import { Locale } from 'src/shared/enum/locale.enum';
import { ObjectIsAuctionRules } from 'src/shared/validation/decorators/auction-limits-object.decorator';
import { ObjectIsLocalizedString } from 'src/shared/validation/decorators/localized-string.decorator';
import { ValidationErrorMessage } from 'src/shared/validation/validation-error-message';
import { UpdateAuctionRequest } from '../../auction.service';

export class AuctionUpdateDto implements UpdateAuctionRequest {
//   @ApiProperty({
//     description: 'Id of the auction',
//   })
//   @IsOptional()
//   @IsUUID()
//   id?: string;

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
