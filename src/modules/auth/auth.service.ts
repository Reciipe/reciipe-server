import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth, AuthDocument } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
  ) {}

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

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
