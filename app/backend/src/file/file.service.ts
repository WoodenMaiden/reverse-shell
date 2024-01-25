import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileView } from './FileView.model';
import { exec } from 'child_process';

@Injectable()
export class FileService {
  constructor(@InjectModel(FileView) private fileView: typeof FileView) {}

  async incrementViews(ip: string, filename: string) {
    try {
      await this.fileView.increment('view_count', { where: { ip, filename } });
    } catch (e) {
      this.fileView.create({ ip, filename });
    }
  }

  async readFile(filename: string, ip: string) {
    return new Promise((res, rej) => {
      exec(`cat /tmp/${filename}`, (err, stdout, stderr) => {
        if (err) {
          return rej(err);
        }

        this.incrementViews(ip, filename);

        return res(stdout + '\n\n' + stderr);
      });
    });
  }

  async getAllFiles() {
    return new Promise((res, rej) => {
      exec(`ls /tmp/`, (err, stdout, stderr) => {
        if (err) {
          return rej(err);
        }

        return res(stdout + '\n\n' + stderr);
      });
    });
  }
}
