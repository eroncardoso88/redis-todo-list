export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
  database: {
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: process.env.JWT_EXPIRATION || '3600s',
  },
});