import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import admin from "firebase-admin";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

let db;
async function connectToDB() {
  /*
   * Keep in mind that codespace removes docker / mongodb on restart
   * Need to re-install mongodb
   * docker rm mongodb
   * docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
   * mongosh --port 27017
   * use full-stack-react-db
   * run db.articles.insertMany([
   * {name : 'learn-node', upvotes: 2, upvoteIds: [],comments :[]},
   * {name : 'learn-react', upvotes: 5, upvoteIds: [], comments :[]},
   * {name : 'mongodb', upvotes: 3, upvoteIds: [],comments :[]},
   * ])
   */

  const uri = process.env.MONGODB_USERNAME
    ? `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.cbpqckr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    : "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();

  db = client.db("full-stack-react-db");
}

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;

  const article = await db.collection("articles").findOne({ name });

  res.json(article);
});

// middleware to be used by all below endpoints
app.use(async function (req, res, next) {
  const { authtoken } = req.headers;

  if (authtoken) {
    const user = await admin.auth().verifyIdToken(authtoken);
    req.user = user;
    next();
  } else {
    res.sendStatus(400);
  }
});

app.post("/api/articles/:name/upvote", async (req, res) => {
  const name = req.params.name;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  const upvoteIds = article.upvoteIds || [];
  const canUpvote = uid && !upvoteIds.includes(uid);

  if (canUpvote) {
    const updateArticle = await db.collection("articles").findOneAndUpdate(
      { name },
      {
        $inc: { upvotes: 1 },
        $push: { upvoteIds: uid },
      },
      {
        returnDocument: "after",
      }
    );

    res.json(updateArticle);
  } else {
    res.sendStatus(403);
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const name = req.params.name;
  const { postedBy, text } = req.body;
  const newComment = { postedBy, text };
  const updatedArticle = await db.collection("articles").findOneAndUpdate(
    { name },
    {
      $push: { comments: newComment },
    },
    {
      returnDocument: "after",
    }
  );

  res.json(updatedArticle);
});

app.post("/hello", function (req, res) {
  res.send("Hello " + req.body.name + "from post!");
});

const PORT = process.env.PORT || 8000;

async function start() {
  await connectToDB();

  app.listen(PORT, function () {
    console.log("Server is listening on port " + PORT);
  });
}
start();
