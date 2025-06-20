const mongoose = require("mongoose");
const { server } = require("./app");
const logger = require("./config/logger");
const connectToCluster = require("./utils/connectMongoClient");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, './.env') });

// server listening
const port = process.env.PORT
server.listen(port, async () => {
  logger.info(`Listening on port ${port}`);
});

mongoose.set('toObject', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted.__v
  }
});

// connection mongo database
const dbUrl = process.env.MONGODB_URL
mongoose
  .connect(dbUrl, {})
  .then(async () => {
    logger.info("Connected to MongoDB");

    // setup mongoClient globally scope
    global.mongoClient = await connectToCluster(dbUrl);
  });

// handler server close
const exitHandler = async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  
    // auto restart server
    server.listen(port, async () => {
      logger.info(`Restarting server on ${port}`);
    });
  };
  
  // handler unexpected error
  const unexpectedErrorHandler = (error) => {
    logger.error(`unexpected error: ${error}`);
    exitHandler().catch((err) => {
      logger.error(`error when restarting server: ${err}`);
    });
  };
   
  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
  process.on("SIGTERM", unexpectedErrorHandler);