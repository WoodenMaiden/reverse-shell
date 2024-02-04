import { Controller, Get, Param, Req, Logger } from '@nestjs/common';
import { Request } from 'express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Req() req: Request) {
    const result = await this.fileService.readFile(filename, req.ip);
    Logger.log(`${filename}`);
    return { content: result };
  }

  @Get()
  async getAllFiles() {
    const result = await this.fileService.getAllFiles();
    Logger.log(`${result}`);
    return result;
  }
}
