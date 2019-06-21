const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models/models.js");

const PORT = process.env.PORT || 3000;
const MONGO_DB = process.env.MONGODB_URI || "mongodb://localhost/newsDB";

mongoose.connect(MONGO_DB);
mongoose.set("useFindAndModify", false);
const models = require("./models/models");
models.NewsPost.createCollection();

const app = express();

app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Routes

//GET route for scraping the site

app.get("/scrape", (req, res) => {
  axios.get("https://old.reddit.com/r/science/").then(response => {
    const $ = cheerio.load(response.data);

    $("div.top-matter").each(function(i, element) {
      const result = {};

      result.title = $(this)
        .children("p.title")
        .text();
      result.link = $(this)
        .children("p.title")
        .children("a")
        .attr("href");

      db.NewsPost.create(result)
        .then(function(dbNewsPost) {
          console.log(dbNewsPost);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});

//Route for getting all Articles from the db

app.get("/stories", (req, res) => {
  db.NewsPost.find({})
    .then(dbNewsPost => {
      res.json(dbNewsPost);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/comment", (req, res) => {
  // const {id, name, message} = req.body;
  // if(!id) {
  //     response.send()
  // }
});

app.listen(PORT, () => console.log("App running on port" + PORT));
