import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from './schema/resume.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) // dùng dependencies nhúng model để dùng 
  private ResumeModel: Model<Resume>) { }
  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const { url, companyId, jobId } = createResumeDto
    const { email, _id } = user
    const newCv = await this.ResumeModel.create({
      url, companyId, jobId, email,
      userId: _id,
      status: "Pending",
      createdBy: {
        id: user._id,
        email: user.email
      }
    })
    return newCv
  }

  async findAll(curentPage: number, limit: number, qs) {
    const { filter, population, sort, projection } = aqp(qs);
    delete filter.page
    delete filter.limit
    let offset = (+curentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;// 
    const totalItems = (await this.ResumeModel.find(filter)).length;//đêm tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit);//tính ra số trang làm tròn trang 

    const result = await this.ResumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: curentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện queryyy
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    try {
      return await this.ResumeModel.findById(id)
    } catch (error) {
      return error
    }
  }
  async update(_id: string, status: string, user: IUser) {
    return await this.ResumeModel.updateOne({ _id: _id }, {
      status
      , updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }
  async remove(id: string) {
    return await this.ResumeModel.deleteOne({ _id: id })
  }
}
