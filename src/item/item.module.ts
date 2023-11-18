import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemController } from './item.controller';
import { Item, ItemSchema } from './item.schema';
import { ItemService } from './item.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
