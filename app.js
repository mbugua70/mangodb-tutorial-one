const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./atlas_uri");

const app = express();
app.use(express.json());

// db connection
let db;
const PORT = 3000;
connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}...`);
    });
    db = getDb();
  }
});

app.get("/books", (req, res) => {
  const page = req.query.p || 0;
  const bookPage = 3;
  let books = [];
  db.collection("books")
    .find() // return what is called a cursor which points to the collection of all doc
    .sort({ author: 1 })
    .skip(page * bookPage)
    .limit(bookPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json({ success: true, data: books });
    })
    .catch(() => {
      res.status(500).json({ success: false, msg: "Could not fetch the data" });
    });
});

// single document using id/ params

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        if (!doc) {
          res
            .status(200)
            .json({ success: true, msg: "Could not find the doc id" });
        } else {
          res.status(200).json({ success: true, data: doc });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ success: false, msg: "Could not fetch the data" });
      });
  } else {
    res
      .status(500)
      .json({ success: false, msg: "The id fetched is not a valid id" });
  }
});

// post request

app.post("/books", (req, res) => {
  const book = req.body;
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json({ success: true, data: result });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ success: false, err: "Could not add a new document" });
    });
});

// delete request

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((testOne) => {
        res.status(200).json({
          success: true,
          data: testOne,
          msg: "Doc deleted successful",
        });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ success: false, err: "Could not delete the doc" });
      });
  } else {
    res.status(500).json({ success: false, msg: "Not a valid doc id" });
  }
});

// patch request
app.patch("/books/:id", (req, res) => {
  const update = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
      .then((updated) => {
        res.status(200).json({
          success: true,
          data: updated,
          msg: "Doc updated successful",
        });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ success: false, err: "Could not update the doc" });
      });
  } else {
    res.status(500).json({ success: false, msg: "Not a valid doc id" });
  }
});
// toArray - this one fetches all doc that the cursor points to and assign them to a new array.
