import { Exception } from '@adonisjs/core/build/standalone'
import { Storage } from '@google-cloud/storage'
import { randomUUID } from 'crypto'
import { existsSync } from 'fs'

interface iNewFile {
  filePath: string
  fileName: string
}
export class NewFile implements iNewFile {
  public filePath: string
  public fileName: string
  constructor(filePath: string, extension: string) {
    if (this.checkIsFileExists(filePath)) {
      this.filePath = filePath
    } else {
      throw new Exception('File not exists', 500)
    }

    this.fileName = this.generateFilename(extension)
  }

  private checkIsFileExists(filePath: string) {
    return existsSync(filePath)
  }

  private generateFilename(extension: string) {
    return randomUUID() + '.' + extension
  }
}

type iKamalanBuckets =
  | 'kamalan-event-images'
  | 'kamalan-registry-designs'
  | 'kamalan-brand-thumbnail'
  | 'kamalan-product-images'
  | 'kamalan-registry-image'
class CloudStorage {
  private storage: Storage
  constructor() {
    this.storage = new Storage()
  }

  public async upload(bucketName: iKamalanBuckets, file: iNewFile) {
    const [res] = await this.storage
      .bucket(bucketName)
      .upload(file.filePath, { destination: file.fileName })
    return res.publicUrl()
  }
}

export const CloudStorageInstance = new CloudStorage()
