import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateGroupDto, GetListGroupDto } from './group.dto';
import { Group } from './group.schema';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async createGroup(userId: string, data: CreateGroupDto) {
    return this.groupModel.create(Object.assign(data, { user: userId }));
  }

  async getListGroup(query: GetListGroupDto) {
    const { cursor, limit, search } = query;
    const filter = {} as FilterQuery<Group>;

    if (cursor) {
      filter._id = { $lt: cursor };
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const docs = await this.groupModel.aggregate([
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

  async getGroupDetail(groupId: string) {
    return this.groupModel.findById(groupId);
  }

  async deleteGroup(userId: string, groupId: string) {
    return this.groupModel.deleteOne({ _id: groupId, user: userId });
  }
}
