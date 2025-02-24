const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: String,
  link: String,
  summary: String,
  category: String,
  language: String,
  publishedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("News", newsSchema);
