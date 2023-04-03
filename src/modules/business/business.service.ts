import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Business, BusinessDocument } from './entities/business.entity';
import { Model } from 'mongoose';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name)
    protected businessModel: Model<BusinessDocument> & any,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<any> {
    try {
      let business = new this.businessModel({ ...createBusinessDto });
      business = await business.save();
      return business;
    } catch (error) {
      throw new Error(
        'Error adding new business in create methid in business.service.ts file' +
          '\n' +
          `error message: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const businesses = await this.businessModel.find().exec();
      return businesses;
    } catch (error) {
      throw new Error(
        `Error retrieving all businesses from mongo 
        \nfrom findAll method in business.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const business = await this.businessModel.findById(id).exec();
      // throw error if business does not exist
      if (!business) {
        throw new Error(`business with id ${id} not found`);
      }

      if (business.deleted) {
        throw new Error(`business with id ${id} has been deleted`);
      }

      return business;
    } catch (error) {
      throw new Error(
        `Error getting business information for business with id ${id}, 
        \nfrom findOne method in business.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<void> {
    try {
      await this.businessModel.updateOne({
        _id: id,
        ...updateBusinessDto,
      });
    } catch (error) {
      throw new Error(
        `Error update business information for business with id ${id}, 
        \nfrom update method in business.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const business = await this.businessModel
        .findById(id, { deleted: 'true' })
        .exec();

      if (!business) {
        throw new Error(
          `Mongoose error with deleting business with business id ${id} 
          In remove method business.service.ts with dev error message: business with id:${id} not found`,
        );
      }

      return business;
    } catch (error) {
      throw new Error(
        `Error from remove method in business.service.ts. 
        \nWith error message: ${error.message}`,
      );
    }
  }

  async findBusinessByName(name: string): Promise<any> {
    try {
      const business = await this.businessModel.find({ name }).exec();
      return business;
    } catch (error) {
      throw new Error(
        `Error from findBusinessByName method in business.service.ts. 
          \nWith error message: ${error.message}`,
      );
    }
  }

  async findBusinessesByCategoryId(id: string): Promise<any> {
    try {
      // fetch all businesses in the database that match this id in the category object with id field
      const businesses = await this.businessModel.find({ 'category.id': id });
      return businesses;
    } catch (error) {
      throw new Error(
        `Error from findBusinessesByCategoryId method in category.service.ts. 
          \nWith error message: ${error.message}`,
      );
    }
  }
}
