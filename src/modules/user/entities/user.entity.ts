import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Creator } from './creator.entity';
import { Foodie } from './foodie.entity';
import { UserProfile } from 'src/modules/user/user.enums';

export type UserDocument = User & Document;
export type Profile = Foodie | Creator;

@Schema({
  timestamps: true,
  autoCreate: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User {
  @Prop(
    raw({
      profileId: {
        type: Types.ObjectId,
        required: true,
        refPath: 'profileType',
      },
      profileType: {
        type: String,
        required: true,
        enum: Object.values(UserProfile),
        default: 'foodie',
      },
    }),
  )
  profile: { profileId: string | Foodie | Creator; profileType: string };

  @Prop({
    type: Boolean,
    default: false,
    select: false,
  })
  deleted: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics.config = () => {
  return {
    idToken: 'usr',
    hiddenFields: ['deleted'],
  };
};

export { UserSchema };
