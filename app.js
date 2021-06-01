const express = require("express");

//create an instance of express
const app = express();

//activate some middleware
//to support JSON post requests from the client(req.body)
app.use(express.json());
//handle form submission easily
app.use(express.urlencoded({ extended: false }));

app.listen(3001, () => console.log("Listening on http://localhost:3001"));
