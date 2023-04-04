import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { UserProfile } from 'src/modules/user/user.enums';

export class ProfileDto {
  @IsString()
  profileId: Types.ObjectId;

  @IsEnum(UserProfile)
  @IsNotEmpty()
  @IsString()
  profileType: string;
}
