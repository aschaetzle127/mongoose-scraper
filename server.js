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

app.get("/", (req, res) => {
  models.NewsPost.find({}, (_, data) => {
    // console.log(data);
    res.render("index", {
      article: data
    });
  });
});

//scraping function

axios.get("https://old.reddit.com/r/science/").then(response => {
  const $ = cheerio.load(response.data);

  $("div.top-matter").each(function(i, element) {
    const result = {};
    result.id = $(this)
      .children("p.title")
      .text()
      .replace(/[^a-z]/gi, "-")
      .substring(0, 50);
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
  const { id, name, message } = req.body;
  if (!id) {
    res
      .send({
        success: false,
        errorMessage: "Article id is required! Try again."
      })
      .status(500)
      .end();
  } else if (!name || !message) {
    res
      .send({
        success: false,
        errorMessage: "Please provide a name and comment."
      })
      .status(500)
      .end();
  } else {
    models.NewsPost.findOneAndUpdate(
      { id },
      { $push: { comments: [{ name, message }] } },
      (err, res) => {
        if (err) {
          res
            .send({
              success: false,
              errorMessage: "Unable to post comment"
            })
            .status(500)
            .end();
        } else {
          res
            .send({
              success: true,
              errorMessage: ""
            })
            .status(200)
            .end();
        }
      }
    );
  }
});

app.listen(PORT, () => console.log("App running on port" + PORT));
