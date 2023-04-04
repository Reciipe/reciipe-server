import {
  IsString,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  userAccountId: Types.ObjectId | any;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'my_password',
    description: 'The password of the user account.',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'abcd1234',
    description: 'The verification code of the user account.',
    required: false,
  })
  verification_code: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2023-04-03T10:00:00Z',
    description: 'The expiration date of the verification code.',
    required: false,
  })
  verify_code_expiration: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'my_password_reset_token',
    description: 'The password reset token of the user account.',
    required: false,
  })
  password_reset: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'abcd1234',
    description: 'The password reset code of the user account.',
    required: false,
  })
  password_reset_code: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2023-04-03T10:00:00Z',
    description: 'The expiration date of the password reset code.',
    required: false,
  })
  reset_code_expiration: Date;

  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'Whether the user is required to change their password.',
    default: false,
  })
  change_password: boolean;
}
