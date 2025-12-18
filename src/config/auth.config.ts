import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  };
  bcrypt: {
    saltOrRounds: number;
  };
}

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    },
    bcrypt: {
      saltOrRounds: Number(process.env.BCRYPT_SALT_OR_ROUNDS),
    },
  }),
);
