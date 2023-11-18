import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateItemDto, GetListItemDto } from './item.dto';
import { Item } from './item.schema';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async createItem(userId: string, data: CreateItemDto) {
    return this.itemModel.create(Object.assign(data, { user: userId }));
  }

  async getListItem(query: GetListItemDto) {
    const { cursor, limit, search } = query;
    const filter = {} as FilterQuery<Item>;

    if (cursor) {
      filter._id = { $lt: cursor };
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const docs = await this.itemModel.aggregate([
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
          amount: 1,
          currency: 1,
          transactionType: 1,
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

  async getItemDetail(itemId: string) {
    return this.itemModel.findById(itemId);
  }

  async deleteItem(userId: string, itemId: string) {
    return this.itemModel.deleteOne({ _id: itemId, user: userId });
  }
}
