const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const Item = require("./models/item");
const itemsRouter = require("./routes/items");
const dotenv = require("dotenv");
dotenv.config();

// DB connection
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.u2n6q.mongodb.net/toDoListDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", () =>
  console.log("Database connection established")
);

//create an instance of express
const app = express();

//activate some middleware
//to support JSON post requests from the client(req.body)
app.use(express.json());
//handle form submission easily
app.use(express.urlencoded({ extended: false }));

app.use("/items", itemsRouter);

//Routes --> URIs (URLs)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World!",
  });
});

/*
Create a controller to support 4 CRUD methods (make routes)
- /items (POST)
- /items (GET)
- /items/:id (GET)
- /items/:id (DELETE)
- /items/:id (PUT / update)
*/

app.use((req, res, next) => {
  const error = new Error("Something is broken");
  error.status = 400;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: { message: err.message } });
});

app.listen(3001, () => console.log("Listening on http://localhost:3001"));
