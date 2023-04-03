import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from './entities/business.entity';
import { Category, CategorySchema } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, CategoryService],
})
export class BusinessModule {}
