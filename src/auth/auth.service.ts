import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import ms from 'ms';
import { use } from 'passport';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }
    async validateUser(username: string, password: string): Promise<any> {//kiểm tra xem người dùng tồn tại chưa
        // và mật khẩu email có đúng không
        const user = await this.usersService.findOnebyUser(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(password, user.password);
            if (isValid === true) {
                return user
            }
        }
        return null;
    }



    //tạo ra jwt và truyền lên các thông tin mã hóa
    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role,
        };
        const refresh_token = this.createRefresh(payload)// tạo ra refresh token với các thông tin trong payload
        //update refresh token database
        await this.usersService.updateUsertoken(refresh_token, _id)
        //set cookie gán refresh vào cookies
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
        })
        return { // trả về phả hồi
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }
        };
    }
    // tạo ra refresh token
    createRefresh = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
        })
        return refresh_token
    }
    //đăng kí người dùng 
    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user)
        return newUser
    }
    //create refreshtoken mới khi đã lưu vào cookies
    async processNewToken(refreshtoken: string, response: Response) {
        try {
            this.jwtService.verify(refreshtoken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            })
            let user = await this.usersService.findUserbyToken(refreshtoken);
            if (user) {
                const { _id, name, email, role } = user
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };
                const refresh_token = this.createRefresh(payload)
                //update refresh token database
                await this.usersService.updateUsertoken(refresh_token, _id.toString())
                //set cookie
                response.clearCookie("refresh_token")
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role
                    }
                };
            } else {
                throw new BadRequestException('Refresh token không hợp lệ , vui lòng đăng nhập')
            }

        } catch (error) {
            throw new BadRequestException('Refresh token không hợp lệ , Vui lòng đăng nhập')
        }
    }
    //Logout USER
    async processLogout(response: Response, refreshToken) {
        await this.usersService.findUserbyToken(refreshToken)
        response.clearCookie('refresh_token')
        return "OK"
    }

}
