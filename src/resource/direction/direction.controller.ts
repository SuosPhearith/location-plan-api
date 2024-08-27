import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DirectionService } from './direction.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { FileExcelPipe } from 'src/file/validation/file-excel.pipe';
import { File as MulterFile } from 'multer';
import { SearchDto } from 'src/global/dto/search.dto';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Role } from 'src/global/enum/role.enum';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization/authorization.guard';

@Controller('api/v1/direction')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(
    @Body() createDirectionDto: CreateDirectionDto,
    @UploadedFile(FileExcelPipe) file: MulterFile,
  ) {
    return this.directionService.create(createDirectionDto, file);
  }

  @Get()
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async findAll(@Query() searchDto: SearchDto) {
    const { query, page, limit } = searchDto;
    return this.directionService.findAll(query, page, limit);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('order') order: string,
  ) {
    return this.directionService.findOne(+id, order);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.directionService.remove(+id);
  }
}
