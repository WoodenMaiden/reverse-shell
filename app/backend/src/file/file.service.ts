import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FileView } from "./FileView.model";
import { exec } from "child_process";
import { glob } from "glob";

@Injectable()
export class FileService {
  constructor(@InjectModel(FileView) private fileView: typeof FileView) {}

  async incrementViews(ip: string, filename: string) {
    try {
      await this.fileView.increment("view_count", { where: { ip, filename } });
    } catch (e) {
      this.fileView.create({ ip, filename });
    }
  }

  async readFile(filename: string, ip: string): Promise<string> {
    return new Promise((res, rej) => {
      exec(`cat /content/${filename}`, (err, stdout, stderr) => {
        if (err) {
          return rej(err);
        }

        try {
          this.incrementViews(ip, filename);
        } catch (e) {
          Logger.error(e);
        }

        return res(stdout || stderr);
      });
    });
  }

  async getAllFiles(): Promise<string[]> {
    try {
      const results = await (
        await glob(`/content/**/**`, {
          absolute: false,
          nodir: true,
        })
      ).map((f) => f.split("/").slice(2).join("/"));
      return results;
    } catch (e) {
      return [];
    }
  }
}
