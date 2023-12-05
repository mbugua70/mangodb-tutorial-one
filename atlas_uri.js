const { MongoClient } = require("mongodb");

let dbConnect;

module.exports = {
  // initialy connect to the dtbase
  connectToDb: (cb) => {
    // connect () - will take the arguement as the connection string which is lke a special url connection to the dtbase
    // local database
    MongoClient.connect("mongodb://localhost:27017/bookstore")
      .then((client) => {
        dbConnect = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  //   return the db after we have connect to it

  getDb: () => dbConnect,
};
