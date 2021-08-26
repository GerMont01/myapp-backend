var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function createNewCollection(collectionName) {
   MongoClient.connect(url, function(err, db) {
        if (err) console.log(err);
        var dbo = db.db("UserDB");
        dbo.createCollection(collectionName, function(err, res) {
            if (err) console.log(err);
            console.log("Collection created!");
            db.close();
        });
    }); 
}

createNewCollection('Users')
createNewCollection('Admin')