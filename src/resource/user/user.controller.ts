import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchDto } from 'src/global/dto/search.dto';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Role } from 'src/global/enum/role.enum';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization/authorization.guard';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async findAll(@Query() searchDto: SearchDto) {
    const { query, page, limit } = searchDto;
    return this.userService.findAll(query, page, limit);
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch(':id/toggle-active')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  toggleActive(@Param('id') id: string) {
    return this.userService.toggleActive(+id);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
