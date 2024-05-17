import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, Length, ValidateNested } from "class-validator";
import mongoose from "mongoose";
export class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId
    @IsNotEmpty()
    name: string
}
//dùng cho admin
export class CreateUserDto { // định dạng dữ liệu và vadidate dữ liệu từ giúp phát hiện lỗi từ phía client
    @IsEmail()
    @IsNotEmpty({ message: "Email không được để trống" })
    email: string;
    @IsNotEmpty({ message: "Password không được để trống" })
    password: string;
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
    @IsNotEmpty({ message: "Tuổi không được để trống" })
    age: string
    @IsNotEmpty({ message: "Giới tính không được để trống" })
    gender: string
    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    andress: string
    @IsNotEmpty({ message: "Role không được để trống" })
    @IsMongoId()
    role: mongoose.Schema.Types.ObjectId
    //validate đối tượng phải dùng như này
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    Company: Company;
}

// dùng cho client
export class RegisterUserDto { // định dạng dữ liệu và vadidate dữ liệu từ giúp phát hiện lỗi từ phía client
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: "Email không được để trống" })
    email: string;
    @IsNotEmpty({ message: "Password không được để trống" })
    password: string;
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
    @IsNotEmpty({ message: "Tuổi không được để trống" })
    age: string
    @IsNotEmpty({ message: "Giới tính không được để trống" })
    gender: string
    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    andress: string

}

export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'tatthang', description: 'username' })
    readonly username: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456',
        description: 'password',
    })
    readonly password: string;
}
