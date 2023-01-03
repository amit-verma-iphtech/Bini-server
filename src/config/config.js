const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    MYSQL_USER: Joi.string().required().description('mysql user'),
    MYSQL_PASSWORD: Joi.string().required().description('mysql password'),
    MYSQL_URL: Joi.string().required().description('mysql url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(120).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    STRIPE_PRIVATE_KEY: Joi.string().description('stripe private key'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  backend_version: '6.1',
  env: envVars.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  slackChannels: {
    ws29: 'https://hooks.slack.com/services/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',
    ws29_alerts: 'https://hooks.slack.com/services/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',
    smark: 'https://hooks.slack.com/services/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',
    edeka: 'https://hooks.slack.com/services/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',
    gebit: 'https://hooks.slack.com/services/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',
  },
  minio: {
    endpoint: 'bini.does-it.net', // 172.28.224.3
    auth: {
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    },
    bucket: {
      visits: 'entrance-bounding-boxes',
      cameras: 'cameras',
    },
  },
  itemsBucket: 'bini-product-photos',
  stripePrivateKey: envVars.STRIPE_PRIVATE_KEY,
};
