import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }
  @Post()
  @ResponseMessage("Create a subscriber")
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }
  @Get()
  findAll() {
    return this.subscribersService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto) {
    return this.subscribersService.update(+id, updateSubscriberDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscribersService.remove(+id);
  }

}

