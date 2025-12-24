import { registerAs } from '@nestjs/config';

export interface FirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

export const firebaseConfig = registerAs(
  'firebase',
  (): FirebaseConfig => ({
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY as string)?.replace(
      /\\n/g,
      '\n',
    ),
  }),
);
