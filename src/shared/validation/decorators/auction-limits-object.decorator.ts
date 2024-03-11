import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { AuctionRuleKey } from '../../enum/auction-rule-key.enum';

export function ObjectIsAuctionRules(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ObjectIsAuctionRules',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'object') {
            return false;
          }

          const auctionRuleKeys = Object.values(AuctionRuleKey);

          for (const [key, objectValue] of Object.entries(value)) {
            if (
              typeof objectValue !== 'string' ||
              !auctionRuleKeys.includes(key as AuctionRuleKey)
            ) {
              return false;
            }
          }

          return true;
        },
      },
    });
  };
}
