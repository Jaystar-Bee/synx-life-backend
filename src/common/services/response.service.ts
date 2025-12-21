import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  constructor() {}

  createResponse(status: number, message: string, data?: any) {
    return {
      status,
      message,
      data,
    };
  }
}
