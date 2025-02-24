const express = require("express");
const { fetchNews } = require("../controllers/newsController");
const router = express.Router();

router.get("/", async (req, res) => {
  const news = await fetchNews();
  res.json(news);
});

module.exports = router;
