class db {
    constructor(){

    }
    MongoClient = require('mongodb').MongoClient;
    url = "mongodb://localhost:27017/";
    createNewCollection(collectionName) {
        this.MongoClient.connect(this.url, function(err, db) {
                if (err) console.log(err);
                var dbo = db.db("UserDB");
                dbo.createCollection(collectionName, function(err, res) {
                    if (err) console.log(err);
                    console.log("Collection created!");
                    db.close();
                });
        }); 
    }

    async registerUser(cred) {
        let db = await this.MongoClient.connect(this.url)
        let dbo = db.db("UserDB");

        if (await dbo.collection("Users").findOne(cred)){
            console.log('User already exists')
        } else {
            try {
                let res = await dbo.collection("Users").insertOne(cred)
                console.log("User Registered");
                await db.close();
                return res
            } catch (err) {
                console.log(err);
                db.close(); 
                return false
            }
        }

    }

    async loginUser(cred) {
        let db = await this.MongoClient.connect(this.url)
        let dbo = db.db("UserDB");
        try {
            let result = await dbo.collection("Users").findOne(cred);
            await db.close;
            return result;
        } catch {
            console.log(err);
            db.close;
            return false
        }
    }
}

exports.db = new db();
