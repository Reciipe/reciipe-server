import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './entities/auth.entity';
import { UserAccountService } from '../user_account/user_account.service';
import {
  UserAccount,
  UserAccountSchema,
} from '../user_account/entities/user_account.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: UserAccount.name, schema: UserAccountSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserAccountService],
})
export class AuthModule {}
