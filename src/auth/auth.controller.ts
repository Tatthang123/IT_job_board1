import { Controller, Post, UseGuards, Request, Get, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Response, Request as Requests } from 'express';
import { IUser } from 'src/users/users.interface';
import { request } from 'http';
import { RolesService } from 'src/roles/roles.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private roleServive: RolesService
    ) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: UserLoginDto, })
    @Post('/login')
    @ResponseMessage("User login")
    handleLogin(
        @Request() req,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response)
    }
    //đăng kí tài khoản cho client
    @Public()
    @ResponseMessage("Register a new  user")
    @Post('/register')
    handleRegister(@Body() RegisterUserDto: RegisterUserDto) {
        return this.authService.register(RegisterUserDto)
    }
    //fetch acount
    @ResponseMessage("Get user acount")
    @Get('/account')
    async handleGetacount(@User() user: IUser) {
        const temp = await this.roleServive.findOne(user.role._id) as any
        user.permissions = temp.permissions;
        return { user }
    }
    //tạo mới refresh token
    @Public()
    @ResponseMessage("Get User by refresh token")
    @Get('/refresh')
    handleRefreshToken(@Req() request: Requests, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token']
        return this.authService.processNewToken(refreshToken, response)
    }
    @Post('/logout')
    @ResponseMessage('logout suscess')
    handleLogout(@Res({ passthrough: true }) response: Response, @Req() request: Requests) {
        const refreshToken = request.cookies['refresh_token']
        return this.authService.processLogout(response, refreshToken)
    }

}
