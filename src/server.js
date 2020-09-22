import express from "express";

//  we create our backend app like this
const app = express();

// endpoint
app.get("/hello", (req, res) => res.send("Hello back!"));

// start the backend-server
app.listen(8000, ( ) => console.log('Listening on Port 8000'))