import express from "express";
// for the post we need and extra module
import bodyParser from "body-parser";
// to be able to use mongodb (npm)
import { MongoClient, MongoCLient } from "mongodb";

//  we create our backend app like this
const app = express();
// parses the json
app.use(bodyParser.json());

// endpoint for '/' --> HOME
app.get("/", (req, res) => res.send("HOME"));
// endpoint for '/test' --> message
app.get("/test", (req, res) =>
  res.send("Tulio estamos al aire (lease con voz de Juanin) !")
);

// new endpoint to vote on a article USING FAKE DATA BASE
app.post("/api/articles/:name/upvote", (req, res) => {
  const articleName = req.params.name;
  articlesInfo[articleName].upvotes += 1;
  res
    .status(200)
    .send(
      `${articleName} now has ${articlesInfo[articleName].upvotes} upvotes`
    );
});

//new POST endpoint for adding comments USING FAKE DATA BASE
app.post("/api/articles/:name/add-comment", (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;

  articlesInfo[articleName].coments.push({ username, text });

  res.status(200).send(articlesInfo[articleName]);
});

// new route to CONNECTING MONGODB + EXPRESS
app.get("/api/articles/:name", async (req, res) => {
  try {
    const articleName = req.params.name;

    const client = await MongoClient.connect("mongodb://localhost:27017/", {
      useNewUrlParser: true,
    });

    const db = client.db("my-blog");

    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(articleInfo);
    client.close();

  } catch (error) {
    res.status(500).json({ message: "Error connecting to db", error });
  }
});

// starting the backend-server
// message just to double-check
app.listen(8000, () => console.log("Listening on Port 8000"));

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
