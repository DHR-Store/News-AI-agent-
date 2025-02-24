import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/news").then((res) => {
      setNews(res.data);
      setLoading(false);
    });
  }, []);

  return loading ? <LoadingScreen /> : (
    <div>
      <Navbar />
      <div className="news-container">
        {news.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
