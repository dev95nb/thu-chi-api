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
import { CreateGroupDto, GetListGroupDto } from './group.dto';
import { GroupService } from './group.service';

@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createGroup(
    @Req() req: { user: ITokenData },
    @Body() body: CreateGroupDto,
  ) {
    const { userId } = req.user;
    return this.groupService.createGroup(userId, body);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Get()
  getListGroup(
    @RequestHeaders() headerDto: HeaderDto,
    @Query() query: GetListGroupDto,
  ) {
    const limit = query.limit ?? DEFAULT_LIMIT_PAGING;
    return this.groupService.getListGroup(Object.assign(query, { limit }));
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Get(':groupId')
  getGroupDetail(@Query('groupId') groupId: string) {
    return this.groupService.getGroupDetail(groupId);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Delete(':groupId')
  deleteGroup(
    @Req() req: { user: ITokenData },
    @Query('groupId') groupId: string,
  ) {
    const { userId } = req.user;
    return this.groupService.deleteGroup(userId, groupId);
  }
}
