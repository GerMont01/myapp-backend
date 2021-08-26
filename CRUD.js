'use strict';


class SimpleCrudDB {
    // store your records here
    inMemoryDatabase = [];
    // import this and begin to use it
    fs = require("fs");

    constructor(aFileName) {
        this.fileName = aFileName;
        // this is the filename you will save to add code below to create that file, or
        // open it when this class is instantiated, ie: your program start, it loads
        // the database from the file, into the this.inMemoryDatabase
    }

    inMemoryDatabase = JSON.parse(this.reloadDB(this.fileName));

    Create(email, password)
    {
      // add code to store a record in your database
      if (!email || !password){
         return false
      }
      if (this.Read(email)) {
          return false
      } else {
          this.inMemoryDatabase.push({email: email, password: password})
          return true
      }
      // return true if success, false if not
    };

    Read(email) {
      // add code to read record from database
      if (!email) {
        return false
      }
      let findUser = this.inMemoryDatabase.find(user => user.email === email)
      if (findUser) {
        return findUser
      } else {
          return false
      }
        // return undefined if no record exists, otherwise, return the record
    }



    Update(email, newRecordData) {
       // add code to update a record in the database
      let res = false;
      this.inMemoryDatabase.find(user => {
        if(user.email === email){
          
          if (newRecordData.username) user.username = newRecordData.username
          if (newRecordData.password) user.password = newRecordData.password
          res = true

        } else {
          res= false
        }
      })
      return res
       // return true if success, false if not


    };


    Delete(email)
    {
      // add code to delete a user in the database
      this.inMemoryDatabase.find(user => {
        if(user.email === email){
          this.inMemoryDatabase[this.inMemoryDatabase.indexOf(user)] = {}
          return true
        } else {
          return false
        }
      })
    // return true if success, false if not
    };


    flushDB() {
        // flush the inmemoryDatabase to disk (ie: save the database to disk)
        this.fs.writeFile(this.fileName, JSON.stringify(this.inMemoryDatabase) , (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully")
        }})
    }


    reloadDB() {
        // relead the database from disk
        try {
            return this.fs.readFileSync('../db/mydb.json', 'utf8')
          } catch (err) {
            return err
          }
        
    }
}

const crud = new SimpleCrudDB('../db/mydb.json')
exports.crud = crud;
