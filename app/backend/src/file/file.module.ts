import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileView } from './FileView.model';

@Module({
  imports: [
    SequelizeModule.forFeature([FileView]),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
