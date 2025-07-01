export const ENV_VARS = {
  PORT: 'PORT',
  DATABASE: {
    HOST: 'DB_HOST',
    PORT: 'DB_PORT',
    USERNAME: 'DB_USERNAME',
    PASSWORD: 'DB_PASSWORD',
    NAME: 'DB_NAME',
  },
} as const;

// configService.get() constants for better maintainability
export const CONFIG_KEYS = {
  PORT: 'port',
  DATABASE: {
    HOST: 'database.host',
    PORT: 'database.port',
    USERNAME: 'database.username',
    PASSWORD: 'database.password',
    NAME: 'database.name',
  },
} as const;
