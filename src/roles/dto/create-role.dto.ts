import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, isMongoId } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: "Name không được để trống" })
    name: string;

    @IsNotEmpty({ message: "description không được để trống" })
    description: string;

    @IsNotEmpty({ message: "isActive  không được để trống" })
    @IsBoolean({ message: "isActive phải là giá trị boolean" })
    isActive: string

    @IsNotEmpty({ message: "Permission  không được để trống" })
    @IsArray()
    @IsMongoId({ each: true })
    permissions: mongoose.Schema.Types.ObjectId[]


}
