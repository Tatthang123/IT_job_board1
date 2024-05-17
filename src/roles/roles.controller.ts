import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ResponseMessage("create a role ")
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage("find all role")
  findAll(
    @Query("page") curentPage: string,
    @Query("limit") limit: string,
    @Query() qs: string
  ) {
    return this.rolesService.findAll(+curentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("find a role")
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);

  }
  @ResponseMessage("update a role")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage("delete a role")
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
