import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileView } from './FileView.model';
import { exec } from 'child_process';
import { glob } from 'glob';

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

  async readFile(filename: string, ip: string): Promise<string> {
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


  async getAllFiles(): Promise<string[]> {
    try {
      const results = await glob(`/tmp/**/**`); 
      return results;
    } catch (e) {
      return [];
    }
  }
}
