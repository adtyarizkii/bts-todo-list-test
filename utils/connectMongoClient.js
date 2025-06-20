const { MongoClient } = require('mongodb')
const logger = require('../config/logger');

module.exports = async function connectToCluster(uri) {
    let mongoClient

    try {
        mongoClient = new MongoClient(uri, {});
        await mongoClient.connect()
        logger.info('STATE: Successfully connected to MongoDB')
        return mongoClient
    } catch (error) {
        logger.error('STATE: Connection to MongoDB failed!', error)
    }
}
