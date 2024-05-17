import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Permission } from "src/permissions/schema/permission.schema";
export type RoleDocument = HydratedDocument<Role>;
@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string
    @Prop()
    description: string
    @Prop()
    isActive: boolean
    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Permission' }] })
    permissions: Permission[];
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

    @Prop()
    createdAt: Date
    @Prop()
    updatedAt: Date
}
export const RoleSchema = SchemaFactory.createForClass(Role);
