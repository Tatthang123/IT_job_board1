
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type JobDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
    @Prop()
    email: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
    companyId: mongoose.Schema.Types.ObjectId
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job' })
    jobId: mongoose.Schema.Types.ObjectId
    @Prop()
    url: string
    @Prop()
    status: string
    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }
    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }
    createdAt: Date
    @Prop()
    updatedAt: Date

}

export const ResumeSchema = SchemaFactory.createForClass(Resume);