class db {
    constructor(){

    }
    MongoClient = require('mongodb').MongoClient;
    url = "mongodb://localhost:27017/";
    createNewCollection(collectionName) {
        this.MongoClient.connect(this.url, function(err, db) {
                if (err) console.log(err);
                var dbo = db.db("RestaurantDB");
                dbo.createCollection(collectionName, function(err, res) {
                    if (err) console.log(err);
                    console.log("Collection created!");
                    db.close();
                });
        }); 
    }

    async registerUser(cred) {
        let db = await this.MongoClient.connect(this.url)
        let dbo = db.db("RestaurantDB");

        if (await dbo.collection("Users").findOne({email:cred.email})){
            return false
        } else {
            try {
                await dbo.collection("Users").insertOne(cred)
                console.log("User Registered");
                await db.close();
                return true
            } catch (err) {
                console.log(err);
                db.close(); 
                return false
            }
        }

    }

    async loginUser(cred) {
        let db = await this.MongoClient.connect(this.url)
        let dbo = db.db("RestaurantDB");
        try {
            let result = await dbo.collection("Users").findOne(cred);
            await db.close;
            return result;
        } catch(err) {
            console.log(err);
            db.close;
            return false
        }
    }

    async updateUser(query,newvalue) {
        let db = await this.MongoClient.connect(this.url)
        let dbo = db.db("RestaurantDB");
        try {
            let myquery = query;
            let newvalues = { $set: newvalue };
            let res = await dbo.collection("Users").updateOne(myquery, newvalues)
            console.log(res);
            await db.close();
            return true;
        } catch(err) {
            console.log(err)
            db.close;
            return false
        }
    }

    async reserve(reservation) {
        let db = await this.MongoClient.connect(this.url)
        let dbo = db.db("RestaurantDB");

        if (await dbo.collection("Reservations").findOne({numOfPeople:reservation.numOfPeople, time:reservation.time})){
            console.log('Tables unavailable at that time')
        } else {
            try {
                let res = await dbo.collection("Reservations").insertOne(reservation)
                console.log("Reservation Registered");
                await db.close();
                return res
            } catch (err) {
                console.log(err);
                db.close(); 
                return false
            }
        }

    }
}

exports.db = new db();
