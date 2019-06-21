const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const PORT = process.env.PORT || 3000;
const MONGO_DB = process.env.MONGODB_URI || "mongodb://localhost/newsDB";

mongoose.connect(MONGO_DB);
mongoose.set("useFindAndModify", false);
const models = require("./models");
models.NewsPost.createCollection();

const app = express();

app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Routes

app.get("/scrape", (req, res) => {
  axios.get("https://old.reddit.com/r/science/").then(res => {
    const $ = cheerios.load(response.data);
  });
});

app.post("/api/comment", (req, res) => {});

app.listen(PORT, () => console.log("App running on port" + PORT));
