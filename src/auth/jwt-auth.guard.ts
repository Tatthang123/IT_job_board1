import { ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector
    ) {
        super();// dùng được các hàm của class cha
    }
    //tạo ta 1 decorator dành cho những api không cần dùng jwt 
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Token không hợp lệ ");
        }
        return user;
    }
}