import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth, AuthDocument } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  UserAccount,
  UserAccountDocument,
} from '../user_account/entities/user_account.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument> & any,
    @InjectModel(UserAccount.name)
    private readonly userAccountModel: Model<UserAccountDocument>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create the auth account for a user
   * @param authDto
   * @returns jwt token
   */
  async create(authDto: CreateAuthDto): Promise<Auth> {
    try {
      const account = new this.authModel({ ...authDto });
      const auth = await account.save();
      return auth;
    } catch (error) {
      throw new Error(
        `Error creating auth for user, from create method in auth.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  /**
   * Find a user by id
   * @param id - the id of the user
   * @returns {*} - the user info
   * @memberof AuthService
   */
  async findOne(id: string): Promise<any> {
    try {
      const auth = await this.authModel.findById(id);
      return auth;
    } catch (error) {
      throw new Error(
        `Error finding user, from findOne method in auth.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  /**
   * Sign in a user
   * @param userId - the id of the user
   * @param passwoed - the password passed in by the user
   * @returns {*} - the user info, the hashed password, the saved recipes and the JWT
   * @memberof AuthService
   */
  async login(email: string, password: string): Promise<any> {
    try {
      // retrieve the user account
      const userAccount = await this.userAccountModel.findOne({
        email: email,
      });

      // user account exists
      if (userAccount) {
        // retrieve the auth account for the user
        const userAuthAccount = await this.authModel.findOne({
          userAccountId: userAccount.id,
        });

        // auth account does not exist
        if (!userAuthAccount) {
          return {
            success: false,
            message: 'user auth account does not exist',
          };
        }

        // compare the password passed in by the user and the password in the auth account
        const passwordMatch = await bcrypt.compare(
          password,
          userAuthAccount.password,
        );

        // password matches
        if (passwordMatch) {
          // get the saved recipes for the user
          const savedRecipes = [];
          // const savedRecipes = await this.savedRecipeService.findSavedRecipes(
          //   user.id,
          // );

          // create token
          const token = await this.signToken({ userId: userAccount.id });

          // return response
          return {
            message: 'login successful',
            success: true,
            account: userAccount,
            savedRecipes: savedRecipes,
            token: token,
          };
        } else {
          return {
            success: false,
            message: 'password does not match',
          };
        }
      } else {
        return {
          success: false,
          message: 'user account does not exist',
        };
      }
    } catch (error) {
      throw new Error(
        `Error signing in user, from signIn method in auth.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  async signToken(payload: any): Promise<string> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
