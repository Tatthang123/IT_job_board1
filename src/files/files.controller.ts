import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }
  @Public()
  @ResponseMessage('upload file suscess')
  @Post('upload')
  @UseInterceptors(FileInterceptor('fileUpload')) //tên field sử dụng trong form-data
  uploadFile(@UploadedFile(
    //validate upload file
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^(jpg|jpeg|png|image\/png|gif|pdf|application\/pdf|txt|doc|docx|text\/plain)$/i,
      })
      .addMaxSizeValidator({
        maxSize: 10000 * 1024
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File) {
    return { fileName: file.filename }
  }
}