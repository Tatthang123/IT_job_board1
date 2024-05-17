import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './shema/role.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) // dùng dependencies nhúng model để dùng 
  private RoleModel: Model<Role>) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto
    const isExist = await this.RoleModel.findOne({ name })
    if (isExist) {
      throw new BadRequestException(`Role với ${name} đã tồn tại `)
    }
    const newRole = await this.RoleModel.create({
      name, description, isActive, permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newRole
  }

  async findAll(curentPage: number, limit: number, qs) {
    const { filter, population, sort, projection } = aqp(qs);
    delete filter.page
    delete filter.limit
    let offset = (+curentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;// 
    const totalItems = (await this.RoleModel.find(filter)).length;//đêm tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit);//tính ra số trang làm tròn trang 
    const result = await this.RoleModel.find(filter)
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

  async findOne(_id: string) {
    return this.RoleModel.findById(_id)
      .populate({ path: 'permissions', select: { _id: 1, apiPath: 1, name: 1, method: 1 } })
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = updateRoleDto
    const isExist = await this.RoleModel.findOne({ name })
    if (isExist) {
      throw new BadRequestException(`Role với name : ${name} đã tồn tại`)
    }

    return await this.RoleModel.updateOne({ _id }, {
      name, description, isActive, permissions,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }
  async remove(id: string) {
    const foundRole = this.RoleModel.findById(id)
    if ((await foundRole).name === ADMIN_ROLE) {
      throw new BadRequestException('Không thể xóa role AMIN')
    }
    return await this.RoleModel.deleteOne({ id })
  }
}
