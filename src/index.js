const { httpServer: app } = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const sequelize = require('./sequelize');

let server;

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  logger.info(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  const port = process.env.PORT || config.port || 3000;

  await assertDatabaseConnectionOk();
  console.log(`Starting Sequelize + Express example on port ${port}...`);
  app.listen(port, () => {
    console.log(`Express server started   ${port}. Try some routes, such as '/api/users'.`);
  });
}

init();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
