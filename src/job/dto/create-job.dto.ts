import { Transform, Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";
//cách validate ngày bắt đầu phải trước ngày kết thúc 
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
export function IsAfterProperty(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isAfterProperty',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    if (relatedValue instanceof Date && value instanceof Date) {
                        return value > relatedValue;
                    }
                    return false;
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must be after ${relatedPropertyName}`;
                },
            },
        });
    };
}
export class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId
    @IsNotEmpty()
    name: string
}
export class CreateJobDto {

    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ message: "Kĩ năng không được để trống" })
    skills: string[];
    @IsNotEmpty({ message: "Lương không được để trống" })
    salary: number;
    @IsNotEmpty({ message: "Số lượng tuyển không được để trống" })
    quantity: number
    @IsNotEmpty({ message: "Trình độ không được để trống" })
    level: string
    @IsNotEmpty({ message: "Trạng thái không được để trống" })
    description: string
    @Transform(({ value }) => new Date(value))
    @IsNotEmpty({ message: "Ngày bắt đầu tuyển dụng không được để trống" })
    startDate: Date
    @IsAfterProperty('startDate', { message: 'End date must be after start date' })
    @Transform(({ value }) => new Date(value))
    @IsNotEmpty({ message: "Ngày kết thúc tuyển dụng không được để trống" })
    endDate: Date
    @IsNotEmpty({ message: "Trạng thái còn tuyển dụng không được để trống" })
    isActive: boolean
    @IsNotEmpty({ message: "Địa điểm tuyển dụng không được để trống" })
    location: string
    //validate đối tượng phải dùng như này
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    Company: Company;

}
