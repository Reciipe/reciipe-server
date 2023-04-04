import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ProfileType } from './person.entity';

export type FoodieDocument = Foodie & Document;

@Schema({
  timestamps: true,
  autoCreate: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class Foodie extends ProfileType {
  @Prop({
    type: String,
    required: false,
  })
  dietType: string;
}

const FoodieSchema = SchemaFactory.createForClass(Foodie);

FoodieSchema.statics.config = () => {
  return {
    idToken: 'foodie',
    hiddenFields: ['deleted'],
  };
};

export { FoodieSchema };
