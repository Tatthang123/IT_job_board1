import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }
  @ResponseMessage("create a resume")
  @Post()
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }
  @ResponseMessage("Get all user")
  @Get()
  async findAll(
    @Query("page") curentPage: string,
    @Query("limit") limit: string,
    @Query() qs: string
  ) {
    return await this.resumesService.findAll(+curentPage, +limit, qs);
  }

  @ResponseMessage("Get a user")
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.resumesService.findOne(id);
  }
  @ResponseMessage("update a resume")
  @Patch(':id')
  async update(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return await this.resumesService.update(id, status, user);
  }
  @ResponseMessage("delete a resume")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumesService.remove(id);
  }
}
