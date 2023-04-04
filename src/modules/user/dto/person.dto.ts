import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MobileDto } from 'src/common/dto/mobile.dto';

/**
 * Contains all the string fields in person.entity.class
 */
export class PersonDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The first name of the person' })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The last name of the person' })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'The email address of the person' })
  email: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MobileDto)
  @ApiProperty({
    description: 'The mobile phone number of the person',
    example: { phoneNumber: '1234567890', isoCode: 'CA' },
  })
  mobile: MobileDto;
}
