import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IUser } from './user.interface';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getRawUser(filter: FilterQuery<UserDocument>) {
    return this.userModel.findOne(filter);
  }

  createUser(data: User) {
    return this.userModel.create(data);
  }

  async updateUser(userId: string, userData: IUser) {
    return this.userModel.findByIdAndUpdate(userId, userData);
  }

  async getUserByUserId(userId: string) {
    return this.userModel.findById(userId).select('-password -role');
  }

  async getUserDetail(userId: string) {
    return this.userModel.findById(userId).select('-password -role');
  }
}
