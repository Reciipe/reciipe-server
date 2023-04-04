import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UserProfile } from './user.enums';
import { Creator, CreatorDocument } from './entities/creator.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Foodie, FoodieDocument } from './entities/foodie.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    protected userModel: Model<UserDocument> & any,
    @InjectModel(Creator.name)
    public readonly creatorModel: Model<CreatorDocument>,
    @InjectModel(Foodie.name)
    public readonly foodieModel: Model<FoodieDocument>,
  ) {}

  /**
   *
   * @param createUserDto - parsed request body
   * @returns
   */
  async create(userDTO: CreateUserDto): Promise<any> {
    try {
      // get passed in profile type
      const { profile } = userDTO;
      // console.log(profile);
      const { profileType } = profile;

      const ProfileModel =
        profileType === UserProfile.CREATOR
          ? this.creatorModel
          : this.foodieModel;

      // create either merchant or customer object, and set the id to the user account id and save to DB
      let newProfile = new ProfileModel({ ...userDTO });
      newProfile = await newProfile.save();
      // console.log(newProfile);

      // create user object and save to DB
      let user = new this.userModel({
        profile: { profileId: newProfile._id, profileType: profileType },
      });
      // console.log('reachabel');

      user = await user.save();
      return user;
    } catch (error) {
      throw new Error(
        `Error registering user with request DTO ${userDTO}, 
        \nfrom create method in user.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  /**
   * Get all users
   * @returns
   */
  async findAll(): Promise<any> {
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      throw new Error(
        `Error retrieving all users from database 
        \nfrom findAll method in user.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async findOne(id: string): Promise<any> {
    try {
      const user = await this.userModel.findById(id).exec();
      // throw error if user does not exist
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }

      if (user.deleted) {
        throw new Error(`User with id ${id} has been deleted`);
      }

      return user;
    } catch (error) {
      throw new Error(
        `Error getting user information for user with id ${id}, 
        \nfrom findOne method in user.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  /**
   *
   * @param id
   */
  async update(id: string): Promise<void> {
    try {
      // no field to update, but change updatedAt to latest
      await this.userModel.updateOne(
        { _id: id },
        { $set: { updatedAt: new Date() } },
      );
    } catch (error) {
      throw new Error(
        `Error update user information for user with id ${id}, 
        \nfrom update method in user_account.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  /**
   * Implementing soft delete
   * @param id - user id
   * @returns
   */
  async remove(id: string): Promise<any> {
    try {
      const user = await this.userModel
        .findById(id, { deleted: 'true' })
        .exec();

      if (!user) {
        throw new Error(
          `Mongoose error with deleting user with user id ${id} 
          In remove method user.service.ts with dev error message: user with id:${id} not found`,
        );
      }

      return user;
    } catch (error) {
      throw new Error(
        `Error from remove method in user.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }
}
