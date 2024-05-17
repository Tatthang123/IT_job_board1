import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsMongoId()
    @IsNotEmpty({ message: "companyId không được để trống" })
    companyId: mongoose.Schema.Types.ObjectId;
    @IsMongoId()
    @IsNotEmpty({ message: "JobId không được để trống" })
    jobId: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({ message: "url không được để trống" })
    url: string;
}
