/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Locale } from '../../enum/locale.enum';

export function ObjectIsLocalizedString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ObjectIsLocalizedString',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: Record<string, string>, args: ValidationArguments) {
          if (value && typeof value !== 'object') {
            return false;
          }

          const localeKeys = Object.values(Locale);

          for (const [key, objectValue] of Object.entries(value)) {
            if (
              typeof objectValue !== 'string' ||
              !localeKeys.includes(key as Locale)
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
