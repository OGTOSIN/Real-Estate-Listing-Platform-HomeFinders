const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Auth = require("./Models/authModel");
const Property = require("./Models/propertyModel");
const cors = require("cors");
dotenv.config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SavedProperty = require("./Models/savedPropertiesModel");
const routes = require("./Routes");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 1300;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });




//Welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the HomeFinder" });
});


app.use(routes)



