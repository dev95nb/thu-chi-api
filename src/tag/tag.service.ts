import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateTagDto, GetListTagDto } from './tag.dto';
import { Tag } from './tag.schema';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async createTag(userId: string, data: CreateTagDto) {
    return this.tagModel.create(Object.assign(data, { user: userId }));
  }

  async getListTag(query: GetListTagDto) {
    const { cursor, limit, search } = query;
    const filter = {} as FilterQuery<Tag>;

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

  async getTagDetail(tagId: string) {
    return this.tagModel.findById(tagId);
  }

  async deleteTag(userId: string, tagId: string) {
    return this.tagModel.deleteOne({ _id: tagId, user: userId });
  }
}
