const { MongoClient } = require("mongodb")

const mongoUser = process.env.MONGODB_USER
const mongoPass = process.env.MONGODB_PASSWORD
const mongodb = process.env.MONGODB_NAME


let database
class Database {

    // constructor() {
    //     this.setDB()
    // }

    setDB() {
        MongoClient.connect(`mongodb+srv://${mongoUser}:${mongoPass}@cluster0.ywsn7md.mongodb.net/`, { useNewUrlParser: true }, (err, result) => {
            if (err) throw err
            var mongoDb = result.db(mongodb)
            database = mongoDb;
            console.log('mongoDB setup complete');
        })

    }

    async updateLog(body, collectionName, upsert = true) {
        try {
            const { data = {}, id = {} } = body;
            const collection = database.collection(collectionName);
            const result = await collection.updateMany(id, { $set: data }, { upsert: upsert });
            return result;
        } catch (error) {
            console.error('Error updating log:', error);
            throw error;
        }
    }

    async getLogs(query = {}, collectionName, sort = {}, limit = 100, skip = 0) {
        try {
            const collection = database.collection(collectionName);
            const data = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();
            return data ? { success: true, data } : { success: false, data: {} };
        } catch (error) {
            console.error('Error getting logs:', error);
            throw error;
        }
    }

    async addLogs(body, collectionName) {
        const data = body ?? {};
        const collection = database.collection(collectionName);
        const res = await collection.insertOne(data);
        return res;
    }

    async clearLogs(id = {}, collectionName) {
        const res = await database.collection(collectionName).deleteOne(id);
        return res;
    }

    async createCollection(collectionName) {
        return await database.createCollection(collectionName);
    }
}

module.exports = Database;
