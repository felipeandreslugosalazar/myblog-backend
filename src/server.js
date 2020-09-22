import express from "express";
// for the post we need and extra module
import bodyParser from "body-parser";

//  we create our backend app like this
const app = express();

// parses the json
app.use(bodyParser.json());

// endpoint for hello
// GET
app.get("/hello", (req, res) => res.send("Hello get!"));
app.get("/hello/:name", (req, res) => res.send(`Hello ${req.params.name}!`));
// POST
// app.post("/hello", (req, res) => res.send("POST"));
app.post("/hello", (req, res) => res.send(`Hello ${req.body.name} ${req.body.last} !`));

// start the backend-server
app.listen(8000, () => console.log("Listening on Port 8000"));
