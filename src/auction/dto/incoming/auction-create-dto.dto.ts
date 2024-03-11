import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
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

export class AuctionCreateDto implements CreateAuctionRequest {
  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  @ObjectIsLocalizedString({
    message: ValidationErrorMessage.MustBeValidLocalized,
  })
  name!: Record<Locale, string>;

  @IsOptional()
  @IsDate({ message: ValidationErrorMessage.MustBeDate })
  startAt?: Date;

  @IsEnum(AuctionState, {
    message: ValidationErrorMessage.MustBeValidAuctionState,
  })
  state: AuctionState = AuctionState.Scheduled;

  @IsOptional()
  @ObjectIsAuctionRules({
    message: ValidationErrorMessage.MustBeValidAuctionRules,
  })
  limits?: AuctionLimit;

  @IsNotEmpty({ message: ValidationErrorMessage.MustBeFilled })
  @IsString({ message: ValidationErrorMessage.MustBeString })
  itemId!: string;
}
