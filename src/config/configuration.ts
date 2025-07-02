import { ENV_VARS } from './env-vars';

export default () => ({
  port: parseInt(process.env[ENV_VARS.PORT], 10) || 3000,
  jwtSecret: process.env[ENV_VARS.JWT_SECRET],
  database: {
    host: process.env[ENV_VARS.DATABASE.HOST],
    port: parseInt(process.env[ENV_VARS.DATABASE.PORT], 10) || 5432,
    username: process.env[ENV_VARS.DATABASE.USERNAME],
    password: process.env[ENV_VARS.DATABASE.PASSWORD],
    name: process.env[ENV_VARS.DATABASE.NAME],
  },
});
