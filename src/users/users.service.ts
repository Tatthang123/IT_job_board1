import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserM } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {

  constructor(@InjectModel(UserM.name) private userModel: Model<UserM>) { }
  //hash password 
  gethashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }
  // tạo cho admin
  async create(CreateUserDto: CreateUserDto, user: IUser) {

    const { email } = CreateUserDto
    const isExist = await this.userModel.findOne({ email });// tìm email đã tồn tại chưa
    if (isExist) {
      throw new BadRequestException("Email đã được sử dụng vui lòng chọn email khác ")
    }
    const hashpassWord = this.gethashPassword(CreateUserDto.password)

    let newUser = await this.userModel.create({
      email: CreateUserDto.email,
      password: hashpassWord,
      name: CreateUserDto.name,
      age: CreateUserDto.age,
      gender: CreateUserDto.gender,
      andress: CreateUserDto.andress,
      role: CreateUserDto.role,
      Company: CreateUserDto.Company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newUser
  }
  // api client 
  async register(user: RegisterUserDto) {

    const { email, password, name, age, gender, andress } = user
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException("Email đã tồn tại vui lòng chọn email khác ")
    }
    const hashpassWord = this.gethashPassword(password)
    let newRegister = this.userModel.create({
      email,
      password: hashpassWord,
      name,
      age,
      gender,
      andress,
      role: "664324dbe5ea692179e57c7d"
    })
    return newRegister
  }
  async findAll(curentPage: number, limit: number, qs) {
    const { filter, population, sort, projection } = aqp(qs);
    delete filter.page
    delete filter.limit
    let offset = (+curentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;// 
    const totalItems = (await this.userModel.find(filter)).length;//đêm tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit);//tính ra số trang làm tròn trang 
    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found id'
    return await this.userModel.findById(id)
      .populate({ path: "role", select: { name: 1 } }).select("-password")
  }
  // kiểm tra xem người dùng đã tồn tại chưa

  update(updateUserDto: UpdateUserDto, user: IUser) {
    return this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }
  //xóa nhiều người
  remove1(id: string[]) {
    return this.userModel.deleteMany({
      _id: { $in: id }
    })
  }
  // xóa 1 người
  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))

      return this.userModel.deleteOne(
        { _id: id }
      )
  }
  ///Phần đăng nhập và xác thực người dùng
  async findOnebyUser(username: string) {
    return await this.userModel.findOne({
      email: username
    }).populate({ path: "role", select: { name: 1 } })
  }
  //kiểm tra  mật khẩu đúng ko
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }
  //update refresh token vào database
  updateUsertoken = async (refreshToken: string, _id: string,) => {
    return this.userModel.updateOne({ _id }, {
      refreshToken
    });
  }
  //tạo mới token
  async findUserbyToken(refreshToken: string) {
    return this.userModel.findOne({ refreshToken })
  }
}
