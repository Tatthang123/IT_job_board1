import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { JobModule } from './job/job.module';
import { FilesModule } from './files/files.module';
import { ResumesModule } from './resumes/resumes.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { DatabasesModule } from './databases/databases.module';

import { SubscribersModule } from './subscribers/subscribers.module';
import { MailModule } from './mail/mail.module';
import { HealthModule } from './health/health.module';
@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://root:thangyu12@cluster0.wsoaiwc.mongodb.net/CODE?retryWrites=true&w=majority&appName=Cluster0'),
    UsersModule,//
    AuthModule,
  ConfigModule.forRoot({
    isGlobal: true
  }),
    CompaniesModule,
    JobModule,
    FilesModule,
    ResumesModule,
    PermissionsModule,
    RolesModule,
    DatabasesModule,
    SubscribersModule,
    MailModule,
    HealthModule,


  ],// phải khai báo vào root tổng để dùng
  controllers: [AppController],
  providers: [AppService, ConfigService,
  ],
})
export class AppModule { }

