const { MongoClient } = require('mongodb');
const connectionString = "mongodb://wecloud:riQjoBDxr09fnyu8yCa9FeP19Op8UNB1ZFVkxEw3a1cQy25YrPnTzHx460TWBp8vaWIm5ciDRGh6ACDbZ5nHeg==@wecloud.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@wecloud@"
const client = new MongoClient(connectionString);
const collectionName = "wegame";
const dbName = "wegame";
module.exports = async function (context, req) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const gameCollection = db.collection(collectionName);

        const gameData = req.body || {};
        const necessaryField = "Name";

        if (!gameData[necessaryField]) {
            context.res = {
                status: 400, // Bad Request
                body: { code: 400, msg: `Field: [${necessaryField}] is required` }
            };
            return;
        }

        const existingGame = await gameCollection.findOne({ "Name": gameData[necessaryField] });
        if (existingGame) {
            context.res = {
                status: 400, // Bad Request
                body: { code: 400, msg: `A game with the same title [${gameData[necessaryField]}] already exists` }
            };
            return;
        }

        // Convert fields to float where possible
        for (const key in gameData) {
            if (gameData.hasOwnProperty(key)) {
                try {
                    gameData[key] = parseFloat(gameData[key]);
                } catch (e) {
                    // Keep the original value if it's not a number
                }
            }
        }

        // Add timestamps
        gameData.date_added = new Date();
        gameData.update_time = Date.now();

        // Insert the new game data
        await gameCollection.insertOne(gameData);

        context.res = {
            status: 200, // OK
            body: { code: 200, msg: "SUCCESS" }
        };
    } catch (e) {
        context.res = {
            status: 500, // Internal Server Error
            body: { code: 500, msg: `Error: ${e.message}` }
        };
    } finally {
        if (client) {
            client.close();
        }
    }
};