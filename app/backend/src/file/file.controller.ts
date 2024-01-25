import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Req() req: Request) {
    return await this.fileService.readFile(filename, req.ip);
  }

  @Get()
  async getAllFiles() {
    return await this.fileService.getAllFiles();
  }
}
