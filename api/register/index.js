const { MongoClient } = require('mongodb');
const connectionString = "mongodb://wecloud:riQjoBDxr09fnyu8yCa9FeP19Op8UNB1ZFVkxEw3a1cQy25YrPnTzHx460TWBp8vaWIm5ciDRGh6ACDbZ5nHeg==@wecloud.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@wecloud@"
const client = new MongoClient(connectionString);
const collectionName = "user";
const dbName = "games";

async function connectToDb() {
    await client.connect();
    return client.db(dbName).collection(collectionName);
}

function handleError(context, e) {
    context.res = {
        status: 500,
        body: JSON.stringify({ code: 500, msg: e.message }),
        headers: { 'Content-Type': 'application/json' }
    };
}

async function handleRegister(context, collection, username, password) {
    const existingUser = await collection.findOne({ username });
    if (!existingUser) {
        await collection.insertOne({ username, password });
        context.res = {
            status: 200,
            body: JSON.stringify({ code: 200, msg: "SUCCESS", data: {} }),
            headers: { 'Content-Type': 'application/json' }
        };
    } else {
        context.res = {
            status: 400,
            body: JSON.stringify({ code: 400, msg: "Login or Registration failed" })
        };
    }
}

module.exports = async function (context, req) {
    context.log('New user register!');

    if (req.method !== "POST") {
        context.res = {
            status: 400,
            body: JSON.stringify({ code: 400, msg: "Bad Request" }),
            headers: { 'Content-Type': 'application/json' }
        };
        return;
    }

    try {
        const collection = await connectToDb();
        const { username, password } = req.body;

        await handleRegister(context, collection, username, password);
        
    } catch (e) {
        handleError(context, e);
    } finally {
        if (client) {
            client.close();
        }
    }
};