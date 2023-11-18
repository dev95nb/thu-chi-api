import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ITokenData } from '../auth/auth.interface';
import { Role } from '../auth/role/role.decorator';
import { RequestHeaders } from '../base/header.decorator';
import { HeaderDto } from '../base/header.dto';
import { DEFAULT_LIMIT_PAGING } from '../const/common';
import { CreateItemDto, GetListItemDto } from '../item/item.dto';
import { ItemService } from '../item/item.service';
import { UserRole } from '../user/user.schema';

@ApiTags('item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Role([UserRole.ADMIN, UserRole.USER])
  @Post()
  async createTag(
    @Req() req: { user: ITokenData },
    @Body() body: CreateItemDto,
  ) {
    const { userId } = req.user;
    return this.itemService.createItem(userId, body);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Get()
  getListItem(
    @RequestHeaders() headerDto: HeaderDto,
    @Query() query: GetListItemDto,
  ) {
    const limit = query.limit ?? DEFAULT_LIMIT_PAGING;
    return this.itemService.getListItem(Object.assign(query, { limit }));
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Get(':itemId')
  getItemDetail(@Query('itemId') itemId: string) {
    return this.itemService.getItemDetail(itemId);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Delete(':itemId')
  deleteItem(
    @Req() req: { user: ITokenData },
    @Query('itemId') itemId: string,
  ) {
    const { userId } = req.user;
    return this.itemService.deleteItem(userId, itemId);
  }
}
