import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Foodie, FoodieSchema } from './entities/foodie.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Creator, CreatorSchema } from './entities/creator.entity';
import { User, UserSchema } from './entities/user.entity';
import { UserAccountService } from '../user_account/user_account.service';
import {
  UserAccount,
  UserAccountSchema,
} from '../user_account/entities/user_account.entity';
import { AuthService } from '../auth/auth.service';
import { Auth, AuthSchema } from '../auth/entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Foodie.name, schema: FoodieSchema },
      { name: Creator.name, schema: CreatorSchema },
      { name: UserAccount.name, schema: UserAccountSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserAccountService, AuthService, JwtModule],
})
export class UserModule {}
