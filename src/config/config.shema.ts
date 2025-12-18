import * as joi from 'joi';

export default joi.object({
  DB_TYPE: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_SYNC: joi.number().valid(0, 1).required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().required(),
  BCRYPT_SALT_OR_ROUNDS: joi.number().required(),
});
