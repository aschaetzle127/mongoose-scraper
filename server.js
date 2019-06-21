const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const PORT = process.env.PORT || 3000;
const MONGO_DB = process.env.MONGODB_URI || "mongodb://localhost/theDB";

mongoose.connect(MONGO_DB);
mongoose.set("useFindAndModify", false);
const models = require("./models");
models.NewsPost.createCollection();

const app = express();

app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.statis("public"));

//Routes

app.get("/scrape", (req, res) => {});

app.post("/api/comment", (req, res) => {});

app.listen(PORT, () => console.log("App running on port" + PORT));
