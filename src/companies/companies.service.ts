import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './Schema/company.schema';
import { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) // dùng dependencies nhúng model để dùng 
  private CompanyModel: Model<Company>) { }

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.CompanyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }
  async findAll(curentPage: number, limit: number, qs) {
    const { filter, population, sort } = aqp(qs);
    delete filter.page
    delete filter.limit
    let offset = (+curentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;// 
    const totalItems = (await this.CompanyModel.find(filter)).length;//đêm tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit);//tính ra số trang làm tròn trang 
    const result = await this.CompanyModel.find(filter).select('-password')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec()
      ;
    return {
      meta: {
        current: curentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }

  }
  async findOne(id: string) {
    try {
      const company = await this.CompanyModel.findById(id).exec()
      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }
      return company
    } catch (error) {
      throw new HttpException(`Failed to fetch company: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.CompanyModel.updateOne({ _id: updateCompanyDto._id }, {
      ...updateCompanyDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }
  async remove(id: string) {
    return await this.CompanyModel.deleteOne({ _id: id })
  }
}
