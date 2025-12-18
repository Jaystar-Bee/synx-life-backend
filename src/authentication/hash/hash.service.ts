import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ConfigType } from './../../config/config.type';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService<ConfigType>) {}
  public async hashText(text: string): Promise<string> {
    const saltCount = this.configService.get('auth').bcrypt
      .saltOrRounds as number;
    return await bcrypt.hash(text, saltCount || 10);
  }

  public async confirmHash(text: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(text, hash);
  }
}
