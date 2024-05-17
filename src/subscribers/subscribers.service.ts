import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from './schema/subscriber.schema';
import { IUser } from 'src/users/users.interface';
@Injectable()
export class SubscribersService {

  constructor(@InjectModel(Subscriber.name) // dùng dependencies nhúng model để dùng 
  private SubscriberModel: Model<Subscriber>) { }

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { name, email, skills } = createSubscriberDto
    const isExist = await this.SubscriberModel.findOne({ email })
    if (isExist) {
      throw new BadRequestException('Tài khoản đã được đăng kí ')
    }
    const newSUB = await this.SubscriberModel.create({
      name, email, skills,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return newSUB
  }

  findAll() {
    return `This action returns all subscribers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriber`;
  }

  update(id: number, updateSubscriberDto: UpdateSubscriberDto) {
    return `This action updates a #${id} subscriber`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriber`;
  }
}
