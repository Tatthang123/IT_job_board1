import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { Permission } from './schema/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) // dùng dependencies nhúng model để dùng 
  private PermissionModel: Model<Permission>) { }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    try {
      const { name, apiPath, method, module } = createPermissionDto
      const isExist = await this.PermissionModel.findOne({ apiPath, method })
      if (isExist) {
        throw new BadRequestException('Permission đã tồn tại')
      }
      const newPermissions = await this.PermissionModel.create({
        name, apiPath, method, module,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })
      return newPermissions
    } catch (error) {
      return error
    }
  }

  async findAll(curentPage: number, limit: number, qs) {
    const { filter, population, sort, projection } = aqp(qs);
    delete filter.page
    delete filter.limit
    let offset = (+curentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;// 
    const totalItems = (await this.PermissionModel.find(filter)).length;//đêm tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit);//tính ra số trang làm tròn trang 

    const result = await this.PermissionModel.find(filter)
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
    return await this.PermissionModel.findById(id)
  }



  async update(_id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    try {
      return this.PermissionModel.updateOne({ _id }, {
        ...updatePermissionDto
        , updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
    } catch (error) {
      return console.log(error)
    }
  }

  async remove(id: string) {
    return await this.PermissionModel.deleteOne({ id })
  }
}
