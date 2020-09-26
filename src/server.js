import express from "express";
// for the post we need and extra module
import bodyParser from "body-parser";
// to be able to use mongodb (npm)
import { MongoClient, MongoCLient } from "mongodb";

//  we create our backend app like this
const app = express();
// parses the json
app.use(bodyParser.json());

const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017/", {
      useNewUrlParser: true,
    });

    const db = client.db("my-blog");

    await operations(db);

    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to db", error });
  }
};

// endpoint for '/' --> HOME
app.get("/", (req, res) => res.send("HOME"));
// endpoint for '/test' --> message
app.get("/test", (req, res) =>
  res.send("Tulio estamos al aire (lease con voz de Juanin) !")
);

// new route to test CONNECTION BETWEEN MONGODB + EXPRESS
// just to read the info of an article
app.get("/api/articles/:name", async (req, res) => {
  // try {
  withDB(async (db) => {
    const articleName = req.params.name;
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(articleInfo);
  }, res);

  // const client = await MongoClient.connect("mongodb://localhost:27017/", {
  //   useNewUrlParser: true,
  // });

  // const db = client.db("my-blog");

  //   client.close();
  // } catch (error) {
  //   res
  //     .status(500)
  //     .json({ message: "Error connecting / reading to db", error });
  // }
});

// new endpoint to vote on a article USING FAKE DATA BASE (1.)
// new endpoint REFACTORED to vote on a article mongo DATABASE (2.)
app.post("/api/articles/:name/upvotes", async (req, res) => {
  const articleName = req.params.name;

  withDB(async (db) => {
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    await db.collection("articles").updateOne(
      { name: articleName },
      {
        $set: {
          upvotes: articleInfo.upvotes + 1,
        },
      }
    );

    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(updatedArticleInfo);
  }, res);
});

// try {
// const client = await MongoClient.connect("mongodb://localhost:27017/", {
// useNewUrlParser: true,
// });

// const db = client.db("my-blog");

// client.close();
// }
// catch (error) {
//   res
//     .status(500)
//     .json({ message: "Error connecting / updating to db", error });
// }

//new POST endpoint for adding comments USING FAKE DATA BASE
app.post("/api/articles/:name/add-comment", (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;

  withDB(async (db) => {
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    await db.collection("articles").updateOne(
      { name: articleName },
      {
        $set: {
          comments: articleInfo.comments.concat({ username, text }),
        },
      }
    );

    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(updatedArticleInfo);
  }, res);
});

//now we need to persit the data, how ? MongoDB is your friend!
//MongoDB installed using Brew and instructions for WSL.

//datase my-blog created in mongoDB under /data/db
// with

// db.articles.insert([
//   {
//     name: "learn-react",
//     upvotes: 0,
//     coments: [],
//   },
//   {
//     name: "learn-node",
//     upvotes: 0,
//     coments: [],
//   },
//   {
//     name: "my-thoughts-on-resumes",
//     upvotes: 0,
//     coments: [],
//   },
// ]);

// starting the backend-server
// message just to double-check
app.listen(8000, () => console.log("Listening on Port 8000"));
