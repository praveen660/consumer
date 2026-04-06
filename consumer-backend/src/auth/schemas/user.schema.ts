import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Address {
  @Prop() careOf: string;
  @Prop() houseNumber: string;
  @Prop() street: string;
  @Prop() locality: string;
  @Prop() landmark: string;
  @Prop({ required: true }) district: string;
  @Prop({ required: true }) state: string;
  @Prop({ required: true }) pincode: string;
  @Prop() postOffice: string;
  @Prop() subDistrict: string;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  mobile: string;

  @Prop({ required: true })
  date_of_birth: string;

  @Prop({ required: true, enum: ['M', 'F', 'O'] })
  gender: string;

  @Prop({ type: Object, required: true })
  address: Address;

  @Prop()
  pan: string;

  @Prop()
  masked_aadhaar: string;

  @Prop()
  user_type: string;

  @Prop()
  verified_by: string;

  @Prop({ default: false })
  isAccountVerified: boolean;

  @Prop({ default: 'N' })
  email_verified: string;

  @Prop({ default: 'N' })
  isAadhaarSeeded: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
