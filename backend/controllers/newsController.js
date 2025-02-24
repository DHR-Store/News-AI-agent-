const axios = require("axios");
const cheerio = require("cheerio");
const News = require("../models/News");

const fetchNews = async () => {
  const url = "https://timesofindia.indiatimes.com";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  let newsArray = [];

  $("article").each((_, el) => {
    const title = $(el).find("h2").text();
    const link = $(el).find("a").attr("href");
    const summary = $(el).find("p").text();
    if (title && link) newsArray.push({ title, link, summary });
  });

  await News.insertMany(newsArray);
  return newsArray;
};

module.exports = { fetchNews };
