export const ENV_VARS = {
  PORT: 'PORT',
  JWT_SECRET: 'JWT_SECRET',
  DATABASE: {
    HOST: 'DATABASE_HOST',
    PORT: 'DATABASE_PORT',
    USERNAME: 'DATABASE_USERNAME',
    PASSWORD: 'DATABASE_PASSWORD',
    NAME: 'DATABASE_NAME',
  },
} as const;

// configService.get() constants for better maintainability
export const CONFIG_KEYS = {
  PORT: 'port',
  JWT_SECRET: 'jwtSecret',
  DATABASE: {
    HOST: 'database.host',
    PORT: 'database.port',
    USERNAME: 'database.username',
    PASSWORD: 'database.password',
    NAME: 'database.name',
  },
} as const;
