import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto, RegisterUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    _id: string
}// 
