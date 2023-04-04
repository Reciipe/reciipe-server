import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PersonDTO } from './person.dto';
import { ProfileDto } from 'src/common/dto/profile.dto';
import { Types } from 'mongoose';

/**
 * Generic DTO
 * This class has all the possible fields required to register a user
 */
export class CreateUserDto extends PersonDTO {
  @IsNotEmpty()
  profile: ProfileDto;
}
