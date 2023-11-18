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
import { CreateCategoriesDto, GetListCategoriesDto } from './categories.dto';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategories(
    @Req() req: { user: ITokenData },
    @Body() body: CreateCategoriesDto,
  ) {
    const { userId } = req.user;
    return this.categoriesService.createCategories(userId, body);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Get()
  getListCategories(
    @RequestHeaders() headerDto: HeaderDto,
    @Query() query: GetListCategoriesDto,
  ) {
    const limit = query.limit ?? DEFAULT_LIMIT_PAGING;
    return this.categoriesService.getListCategories(
      Object.assign(query, { limit }),
    );
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Get(':categoriesId')
  getCategoriesDetail(@Query('categoriesId') categoriesId: string) {
    return this.categoriesService.getCategoriesDetail(categoriesId);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role([UserRole.ADMIN, UserRole.USER])
  @Delete(':categoriesId')
  deleteCategories(
    @Req() req: { user: ITokenData },
    @Query('categoriesId') categoriesId: string,
  ) {
    const { userId } = req.user;
    return this.categoriesService.deleteCategories(userId, categoriesId);
  }
}
