import * as joi from 'joi';

export default joi.object({
  APP_NAME: joi.string().required(),
  DB_TYPE: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_SYNC: joi.number().valid(0, 1).optional(),
  DB_URL: joi.string().optional(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().required(),
  BCRYPT_SALT_OR_ROUNDS: joi.number().required(),
  OTP_VALIDITY_TIME: joi.string().required(),
  MAIL_HOST: joi.string().required(),
  MAIL_PORT: joi.number().required(),
  MAIL_USER: joi.string().required(),
  MAIL_PASSWORD: joi.string().required(),
  MAIL_SECURE: joi.number().valid(0, 1).optional(),
});
