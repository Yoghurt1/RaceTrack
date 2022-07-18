import { injectable } from 'inversify'
import * as fs from 'fs/promises'

@injectable()
export class FileService {
  public async createFolder(path: string): Promise<void> {
    await fs.mkdir(path)
  }

  public async saveFile(path: string, data: Buffer): Promise<void> {
    await fs.writeFile(path, data)
  }
}
