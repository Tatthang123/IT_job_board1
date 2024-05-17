import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @ResponseMessage('create a permissions')
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('Get all permissions')
  findAll(
    @Query("page") curentPage: string,
    @Query("limit") limit: string,
    @Query() qs: string
  ) {
    return this.permissionsService.findAll(+curentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get a permissions')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('update a permissions')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage("delete a user")
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
