// Backend server for Thrift Happens online shop
// Import
import express, { type Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import ClothesItem from "./models/clothesItem";

// Constant Variables
const server: Express = express();
const port: Number = 3000;
const { MONGO_URI } = process.env;

// Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//Connect to the Database and start the Server

if (!MONGO_URI) {
  throw new Error("Mongo URI is not found in .env file");
}

mongoose
  .connect(MONGO_URI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Connected to Database\nServer is listening on port ${port}`);
    }),
  )
  .catch((error) => console.log(error));

// Routes
// Root Route
server.get("/", (request, response) => {
  response.send("Server is Live");
});

// GET Data API Route
server.get("/data", async (request, response) => {
  try {
    const data = await ClothesItem.find();
    response.status(200).send(data);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// POST Route to Add Clothing Item to Database
server.post("/data", async (request, response) => {
  const {
    id,
    name,
    image,
    fit,
    category,
    size,
    color,
    description,
    price,
    quantity,
    itemQuantity,
  } = request.body;
  const newArticle = new ClothesItem({
    id,
    name,
    image,
    fit,
    category,
    size,
    color,
    description,
    price,
    quantity,
    itemQuantity,
  });
  try {
    await newArticle.save();
    response.status(200).send({
      message: `New item with id ${id} added successfully`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// DELETE Route to Delete One Clothes Article by Id
server.delete("/data/:id", async (request, response) => {
  // Because param converts the id to a string, we reconvert it to a number to abide by the model schema
  const id = Number(request.params.id);
  try {
    await ClothesItem.findOneAndDelete({ id });
    response
      .status(200)
      .send({ message: `Item with id ${id} deleted successfully` });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// PATCH Route to Edit One Clothes Article by Id
server.patch("/data/:id", async (request, response) => {
  const id = Number(request.params.id);
  const clothesArticle = request.body;
  try {
    await ClothesItem.findOneAndUpdate({ id }, { ...clothesArticle });
    response
      .status(200)
      .send({ message: `Item with id ${id} edited successfully` });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});
