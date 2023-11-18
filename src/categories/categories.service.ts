import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateCategoriesDto, GetListCategoriesDto } from './categories.dto';
import { Categories } from './categories.schema';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @InjectModel(Categories.name) private tagModel: Model<Categories>,
  ) {}

  async createCategories(userId: string, data: CreateCategoriesDto) {
    return this.tagModel.create(Object.assign(data, { user: userId }));
  }

  async getListCategories(query: GetListCategoriesDto) {
    const { cursor, limit, search } = query;
    const filter = {} as FilterQuery<Categories>;

    if (cursor) {
      filter._id = { $lt: cursor };
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const docs = await this.tagModel.aggregate([
      {
        $match: filter,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    const hasNextPage = docs.length === limit + 1;
    if (hasNextPage) {
      docs.pop();
    }

    return {
      hasNextPage,
      docs: docs,
    };
  }

  async getCategoriesDetail(tagId: string) {
    return this.tagModel.findById(tagId);
  }

  async deleteCategories(userId: string, tagId: string) {
    return this.tagModel.deleteOne({ _id: tagId, user: userId });
  }
}
