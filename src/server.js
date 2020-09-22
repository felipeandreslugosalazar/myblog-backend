import express from "express";

// for the post we need and extra module
import bodyParser from "body-parser";

// fake database (not persistent I imagine)
const articlesInfo = {
  "learn-react": {
    upvotes: 0,
    coments: [],
  },
  "learn-node": {
    upvotes: 0,
    coments: [],
  },
  "my-thoughts-on-resumes": {
    upvotes: 0,
    coments: [],
  },
};

//  we create our backend app like this
const app = express();

// parses the json
app.use(bodyParser.json());

// endpoint for hello
app.get("/", (req, res) => res.send("HOME"));
app.get("/test", (req, res) =>
  res.send("Tulio estamos al aire (lease con voz de Juanin) !")
);
// GET
// app.get("/hello", (req, res) => res.send("Hello get!"));
// app.get("/hello/:name", (req, res) => res.send(`Hello ${req.params.name}!`));
// POST
// app.post("/hello", (req, res) => res.send("POST"));
// app.post("/hello", (req, res) =>
//   res.send(`Hello ${req.body.name} ${req.body.last} !`)
// );

// new endpoint to vote on a article
app.post("/api/articles/:name/upvote", (req, res) => {
  const articleName = req.params.name;
  articlesInfo[articleName].upvotes += 1;
  res
    .status(200)
    .send(
      `${articleName} now has ${articlesInfo[articleName].upvotes} upvotes`
    );
});

//new endpoint for comments on POST
app.post("/api/articles/:name/add-comment", (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;

  articlesInfo[articleName].coments.push({ username, text });

  res.status(200).send(articlesInfo[articleName]);
});

// starting the backend-server
// message just to double-check
app.listen(8000, () => console.log("Listening on Port 8000"));

//now we need to persit the data, how ? MongoDB is your friend!