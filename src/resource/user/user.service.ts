import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/global/enum/role.enum';
import { ResponseCreateOrUpdateDTO } from 'src/global/dto/response.create.update.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      //hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      //apply hash password
      const savedUser = { ...createUserDto, password: hashedPassword };
      const newUser = await this.prisma.user.create({
        data: { ...savedUser, roleId: Role.user },
      });
      //remove field password
      newUser.password = undefined;
      //response back
      const response: ResponseCreateOrUpdateDTO = {
        data: newUser,
        message: 'Created successfully',
        statusCode: HttpStatus.CREATED,
      };
      return response;
    } catch (error) {
      //check if duplicate
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(query: string, page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of items to skip for pagination

    // Initialize the where clause for filtering
    let where: any = {};

    // Add query conditions if a search query is provided
    if (query) {
      const lowerCaseQuery = query.toLowerCase();

      where = {
        OR: [
          { note: { contains: lowerCaseQuery } },
          { email: { contains: lowerCaseQuery } },
        ],
      };
    }
    try {
      // Execute a transaction to fetch paginated data and count simultaneously
      const [userData, total] = await this.prisma.$transaction([
        // Fetch paginated list of userData based on the where clause
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { id: 'desc' }, // Order by ID in descending order
        }),
        // Fetch the total count of userData based on the where clause
        this.prisma.user.count({
          where,
        }),
      ]);

      // remove password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = userData.map(({ password, ...rest }) => rest);

      // Return the paginated result
      return {
        data: data,
        totalCount: total,
        totalPages: Math.ceil(total / limit), // Calculate total pages
        page,
        limit,
      };
    } catch (error) {
      // Handle any database errors
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { newPassword, confirmPassword } = updateUserDto;
      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Please check confirm password');
      }
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException();
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      return {
        message: 'Reseted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException();
      }
      if (user.roleId === Role.admin) {
        throw new BadRequestException('Cannot delete Admin');
      }
      await this.prisma.user.delete({
        where: { id: user.id },
      });
      return {
        message: 'Deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
  async toggleActive(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException();
      }
      if (user.roleId === Role.admin) {
        throw new BadRequestException('Cannot bad admin account!');
      }
      await this.prisma.user.update({
        where: { id: id },
        data: { status: !user.status },
      });
      return {
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
