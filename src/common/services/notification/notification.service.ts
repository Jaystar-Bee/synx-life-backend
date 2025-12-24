import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './../../../config/config.type';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private readonly configService: ConfigService<ConfigType>) {}
  onModuleInit() {
    // Initialize Firebase
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get('firebase').projectId,
          clientEmail: this.configService.get('firebase').clientEmail,
          privateKey: this.configService.get('firebase').privateKey,
        }),
      });
    } else {
      admin.app();
    }
  }

  async sendPush(fcmToken: string, title: string, body?: string, data?: any) {
    const message = {
      notification: { title, body },
      token: fcmToken,
      android: { priority: 'high' as const },
      data: { click_action: 'FLUTTER_NOTIFICATION_CLICK', ...data },
    };

    try {
      await admin.messaging().send(message);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
