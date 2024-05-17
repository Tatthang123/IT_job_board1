import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post()
  @ResponseMessage('Create a job')
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return await this.jobService.create(createJobDto, user);
  }
  @Public()
  @ResponseMessage('Fill job pagination ')
  @Get()
  findAll(
    @Query("page") curentPage: string,
    @Query("limit") limit: string,
    @Query() qs: string
  ) {
    return this.jobService.findAll(+curentPage, +limit, qs);
  }
  @Public()
  @Get(':id')
  @ResponseMessage('Find a job')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }
  @ResponseMessage('update a job')
  @Patch()
  async update(@Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return await this.jobService.update(updateJobDto, user);
  }
  @ResponseMessage('delete a job')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(id);
  }
}
