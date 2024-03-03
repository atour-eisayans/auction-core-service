import {
  BadRequestException,
  HttpStatus,
  type ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

const generateNestedValidationErrors = (
  error: ValidationError,
  errorsObject: Record<string, string[]>,
  parentName: string = error.property,
) => {
  if (!error.children?.length) {
    return;
  }

  for (const childError of error.children) {
    const localParent = `${parentName}->${childError.property}`;

    if (childError.constraints) {
      errorsObject[localParent] = Object.values(childError.constraints);
    }

    generateNestedValidationErrors(childError, errorsObject, localParent);
  }
};

export const generateValidationErrors = (errors: ValidationError[]) => {
  const message: Record<string, string[]> = {};

  for (const error of errors) {
    if (error.constraints) {
      message[error.property] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      generateNestedValidationErrors(error, message);
    }
  }

  return message;
};

export const validationPipeConfig: ValidationPipeOptions = {
  exceptionFactory: (errors: ValidationError[]): BadRequestException => {
    console.log(errors);
    const message = generateValidationErrors(errors);

    return new BadRequestException({
      message,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  },
  transform: true,
};
