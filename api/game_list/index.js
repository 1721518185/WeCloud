const { MongoClient } = require('mongodb');
const connectionString = "mongodb://wecloud:riQjoBDxr09fnyu8yCa9FeP19Op8UNB1ZFVkxEw3a1cQy25YrPnTzHx460TWBp8vaWIm5ciDRGh6ACDbZ5nHeg==@wecloud.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@wecloud@"
const client = new MongoClient(connectionString);
const collectionName = "wegame";
const dbName = "wegame";

module.exports = async function (context, req) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const body = req.body || {};
        const page = body.page || 1;
        const size = body.size || 10;

        let query_conditions = {};
        ["Name", "Developer", "Distributer"].forEach(key => {
            if (body[key]) {
                query_conditions[key] = { $regex: body[key], $options: "i" };
            }
        });

        context.log(query_conditions);
        const data = await collection.find(query_conditions).skip((page - 1) * size).limit(size).toArray();
        const total = await collection.countDocuments(query_conditions);
        context.res = {
            status: 200,
            body: { code: 200, total: total, data: data, msg: "SUCCESS" }
        };
    } catch (e) {
        context.res = {
            status: 500,
            body: { code: 500, msg: `Error: ${e.message}` }
        };
    } finally {
        if (client) {
            client.close();
        }
    }
};