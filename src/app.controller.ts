import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorator/customize';
@Controller()
export class AppController {
  constructor(// dùng dependencies nhúng vào để dùng thông qua contructor để xử dụng các module riêng biệt
    private readonly appService: AppService,
    private authService: AuthService,
    private configService: ConfigService
  ) { }

}
