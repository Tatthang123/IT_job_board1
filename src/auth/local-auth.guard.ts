import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
//dùng để kiểm tra đăng nhập thành công chưa , nếu thành công thì trả về dữ liệu
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }
