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
import { RequestHeaders } from '../base/header.decorator';
import { HeaderDto } from '../base/header.dto';
import { DEFAULT_LIMIT_PAGING } from '../const/common';
import { CreateTagDto, GetListTagDto } from './tag.dto';
import { TagService } from './tag.service';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTag(
    @Req() req: { user: ITokenData },
    @Body() body: CreateTagDto,
  ) {
    const { userId } = req.user;
    return this.tagService.createTag(userId, body);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Get()
  getListTag(
    @RequestHeaders() headerDto: HeaderDto,
    @Query() query: GetListTagDto,
  ) {
    const limit = query.limit ?? DEFAULT_LIMIT_PAGING;
    return this.tagService.getListTag(Object.assign(query, { limit }));
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Get(':tagId')
  getTagDetail(@Query('tagId') tagId: string) {
    return this.tagService.getTagDetail(tagId);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Delete(':tagId')
  deleteTag(@Req() req: { user: ITokenData }, @Query('tagId') tagId: string) {
    const { userId } = req.user;
    return this.tagService.deleteTag(userId, tagId);
  }
}
