import { IsArray, IsNotEmpty, IsString } from "class-validator";


export class CreateSubscriberDto {

    @IsNotEmpty({ message: "Name không được để trống" })
    name: string;
    @IsNotEmpty({ message: "Name không được để trống" })
    email: string;
    @IsArray()
    @IsNotEmpty({ message: "Name không được để trống" })
    @IsString({ each: true })
    skills: string[];

}


