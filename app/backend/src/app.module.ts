import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileView } from './file/FileView.model';

@Module({
  imports: [
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [FileView],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
