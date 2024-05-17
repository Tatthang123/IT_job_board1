
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
//file này dùng để giải mã token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET")// nhập khóa để giải mã token
        });
    }

    async validate(payload: IUser) { // sau khi giải mã token thì trả về dữ liệu đính kèm
        const { _id, name, email, role } = payload
        return {
            _id,
            name,
            email,
            role
        };
    }
}