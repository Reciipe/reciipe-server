import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Response } from 'express';
import { CategoryService } from '../category/category.service';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post('register')
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      // check if business exists
      const businessExists = await this.businessService.findBusinessByName(
        createBusinessDto.name,
      );

      // business found
      if (Object.keys(businessExists).length != 0) {
        return res.status(HttpStatus.CONFLICT).json({
          success: false,
          message: ' business exists',
          business: null,
        });
      }

      const business = await this.businessService.create(createBusinessDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'business successfully added',
        business: business,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'failed to register user',
        error: err.message,
      });
    }
  }

  @Get('all')
  async findAll(@Res() res: Response): Promise<any> {
    try {
      const business = await this.businessService.findAll();
      const length: number = Object.keys(business).length;
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: `Fetched ${length} businesses`,
        business,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'failed to get list of businesses',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<any> {
    try {
      const business = await this.businessService.findOne(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'business information fetched',
        business,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'failed to retrieve business information',
        error: err.message,
      });
    }
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateBusinessDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.businessService.update(id, updateUserDto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'business information updated',
        business: updateUserDto.name,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'failed to update business information',
        error: err.message,
      });
    }
  }

  //TODO: implemet delete business
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }

  // fetch businesses under a category
  @Get('category/:id')
  async findBusinessesByCategory(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      // check if category exists
      const categoryExists = await this.categoryService.findOne(id);
      if (categoryExists != null) {
        const businesses =
          await this.businessService.findBusinessesByCategoryId(id);
        return res.status(HttpStatus.CREATED).json({
          success: true,
          message: `retrieved ${
            Object.keys(businesses).length
          } businesses under ${categoryExists.name}`,
          businesses: businesses,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'category not found',
          businesses: null,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'failed to get list of businesses under a category',
        error: error.message,
      });
    }
  }
}
