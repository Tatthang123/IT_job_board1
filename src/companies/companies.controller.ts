import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }
  @Post()
  @ResponseMessage("Create a company")
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {

    return this.companiesService.create(createCompanyDto, user);
  }
  @Public()
  @Get()
  @ResponseMessage("Get all company")
  findAll(
    @Query("page") curentPage: string,
    @Query("limit") limit: string,
    @Query() qs: string
  ) {
    return this.companiesService.findAll(+curentPage, +limit, qs);
  }
  @Public()
  @Get(':id')
  @ResponseMessage("Get a company")
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }
  @Patch()
  @ResponseMessage("updated company")
  update(
    @Body()
    updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    try {
      return this.companiesService.update(updateCompanyDto, user);
    } catch (error) {
      return error
    }
  }
  @Delete(':id')
  @ResponseMessage("Delete a company")
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
