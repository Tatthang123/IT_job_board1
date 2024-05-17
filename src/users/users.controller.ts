import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { use } from 'passport';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('users')// tạo ra đường link như http/user như bên expressjs
export class UsersController {
  constructor(private readonly usersService: UsersService) { } // dùng denpendencies
  @Post()
  @ResponseMessage("create a user ")
  //xác định ai tạo ra user này @User 
  async create(@Body() CreateUserDto: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(CreateUserDto, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }
  @Get()
  @ResponseMessage("Get all user")
  async findAll(
    @Query("page") curentPage: string,
    @Query("limit") limit: string,
    @Query() qs: string
  ) {
    try {
      return await this.usersService.findAll(+curentPage, +limit, qs);
    } catch (error) {
      return error
    }
  }
  @Get(':id')
  @ResponseMessage("Get a user")
  findOne(@Param('id')
  id: string) {
    return this.usersService.findOne(id);
  }
  @Patch()
  @ResponseMessage("Update user")
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return await this.usersService.update(updateUserDto, user);
  }
  @Delete()
  @ResponseMessage("Delete a user")
  remove1(@Body() id: string[]) {
    return this.usersService.remove1(id)
  }
  @Delete(':id')
  @ResponseMessage("Delete user")
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
