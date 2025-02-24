import React from "react";
import { motion } from "framer-motion";

const NewsCard = ({ article }) => {
  return (
    <motion.div
      className="news-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{article.title}</h2>
      <p>{article.summary}</p>
      <a href={article.link} target="_blank" rel="noopener noreferrer">Read More</a>
    </motion.div>
  );
};

export default NewsCard;
