const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// Database Connection
const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const addTaskCollection = client
      .db("myDailyActivity")
      .collection("addTasks");

    app.post("/addtask", async (req, res) => {
      const data = req.body;
      const addTask = await addTaskCollection.insertOne(data);
      res.send(addTask);
    });

    app.get("/addtask", async (req, res) => {
      const query = {};
      const cursor = addTaskCollection.find(query);
      const addtasks = await cursor.toArray();
      res.send(addtasks);
    });

    app.get("/addtask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = addTaskCollection.findOne(query);
      const addtasks = await cursor.toArray();
      res.send(addtasks);
    });

    app.patch("/addtask/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: task.title,
          subTitle: task.subTitle,
          details: task.details,
          photoURL: task.photoURL,
        },
      };
      const result = await addTaskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`);
});
