const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");

// DB connection
mongoose.connect(
  "mongodb+srv://dbMariana:test1234@cluster0.u2n6q.mongodb.net/toDoListDatabase?retryWrites=true&w=majority",
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

//models
const { Schema } = mongoose;

//schema
const ItemSchema = new Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
// model
const Item = mongoose.model("Item", ItemSchema);

//create an instance of express
const app = express();

//activate some middleware
//to support JSON post requests from the client(req.body)
app.use(express.json());
//handle form submission easily
app.use(express.urlencoded({ extended: false }));

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

app.post("/items", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  try {
    const item = new Item(body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }

  res.status(200).json({});
});

app.get("/items", async (req, res, next) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
    //res.status(200).json(items) - the same thing
  } catch (error) {
    next(error);
  }
});

app.get("/items/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) throw new createError.NotFound();
    res.status(200).send(item);
  } catch (error) {
    next(error);
  }
});

app.put("/items/:id", async (req, res, next) => {
  const { id } = req.params;
  const dt = req.body;
  try {
    const item = await (await Item.findByIdAndUpdate(id, dt)).exec();
    if (!item) {
      throw new createError.notFound();
    }
    res.status(200).send(item);
  } catch (error) {
    next(error);
  }
});

app.delete("/items", async (req, res, next) => {
  const id = req.body;
  try {
    const item = await Item.findByIdAndDelete(id).exec();
    if (!item) {
      throw new createError.notFound();
    }
    res.status(200).send(item);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  const error = new Error("Something is broken");
  error.status = 400;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: { message: err.message } });
});

app.listen(3001, () => console.log("Listening on http://localhost:3001"));
