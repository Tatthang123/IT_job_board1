import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schema/job.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) // dùng dependencies nhúng model để dùng 
  private JobModel: Model<Job>) { }


  async create(createJobDto: CreateJobDto, user: IUser) {
    return await this.JobModel.create({
      ...createJobDto,
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
    const totalItems = (await this.JobModel.find(filter)).length;//đêm tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit);//tính ra số trang làm tròn trang 

    const result = await this.JobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
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
    return await this.JobModel.findById(id)
  }

  async update(updateJobDto: UpdateJobDto, user: IUser) {
    return await this.JobModel.updateOne({ _id: updateJobDto._id }, {
      ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })

  }

  async remove(id: string) {
    return await this.JobModel.deleteOne({ _id: id })
  }
}
