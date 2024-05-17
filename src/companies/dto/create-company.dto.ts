import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty({ message: "Không được để trống " })
    name: string
    @IsNotEmpty({ message: "Không được để trống" })
    andress: string
    @IsNotEmpty({ message: 'Không được để trống ' })
    description: string
    @IsNotEmpty({ message: 'Không được để trống ' })
    logo: string

}
