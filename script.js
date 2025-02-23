document.addEventListener('DOMContentLoaded', () => {
    let newsPage = 1;
    let videoPageToken = "";
    let currentTopic = "";
    let showingVideos = false;
    let isFetching = false;

    // Secure API Keys (Move these to backend for security)
    const NEWS_API_KEY = "c1cb9b2e0106472fa6d18ecea65c18c6";
    const YOUTUBE_API_KEY = "AIzaSyD_nIPQldNLjCwQc8cl-ggMUYHfbj21u2g";

    // Fetch News Articles
    async function fetchNews(loadMore = false) {
        let topic = document.getElementById('news-topic').value.trim();
        if (!topic) {
            alert("Please enter a news topic.");
            return;
        }

        if (!loadMore) {
            newsPage = 1;
            currentTopic = topic;
            document.getElementById('news-container').innerHTML = '';
            document.getElementById('video-container').innerHTML = '';
            document.getElementById('video-container').classList.add("hidden");
            document.getElementById('news-container').classList.remove("hidden");
        }

        let apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&page=${newsPage}&pageSize=5&apiKey=${NEWS_API_KEY}`;

        try {
            isFetching = true;
            let response = await fetch(apiUrl);
            let data = await response.json();

            if (!data.articles || data.articles.length === 0) {
                alert("No more news found!");
                return;
            }

            let newsContainer = document.getElementById('news-container');

            data.articles.forEach(article => {
                let newsCard = document.createElement('div');
                newsCard.classList.add('news-article');
                newsCard.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description || "No description available."}</p>
                    <img src="${article.urlToImage || 'placeholder.jpg'}" alt="News Image">
                    <p><strong>Source:</strong> ${article.source.name}</p>
                `;

                let readMoreBtn = document.createElement('button');
                readMoreBtn.textContent = "Read More";
                readMoreBtn.addEventListener('click', () => openArticle(article));
                newsCard.appendChild(readMoreBtn);

                let summarizeBtn = document.createElement('button');
                summarizeBtn.textContent = "Summarize";
                summarizeBtn.addEventListener('click', () => summarizeText(article.content));
                newsCard.appendChild(summarizeBtn);

                newsContainer.appendChild(newsCard);
            });

            newsPage++;
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            isFetching = false;
        }
    }

    // Open Article in New Tab
    function openArticle(article) {
        localStorage.setItem("selectedArticle", JSON.stringify(article));
        window.open("details.html", "_blank");
    }

    // Fetch Video News from YouTube
    async function fetchVideos(loadMore = false) {
        if (!currentTopic) {
            alert("Please enter a news topic and fetch news first!");
            return;
        }

        if (!loadMore) {
            videoPageToken = "";
            document.getElementById('video-container').innerHTML = '';
            document.getElementById('news-container').classList.add("hidden");
            document.getElementById('video-container').classList.remove("hidden");
        }

        let videoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(currentTopic)}+news&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
        if (videoPageToken) {
            videoUrl += `&pageToken=${videoPageToken}`;
        }

        try {
            isFetching = true;
            let response = await fetch(videoUrl);
            let data = await response.json();

            if (!data.items || data.items.length === 0) {
                alert("No video news found!");
                return;
            }

            let videoContainer = document.getElementById('video-container');

            data.items.forEach(video => {
                let videoItem = document.createElement('div');
                videoItem.classList.add('video-item');
                videoItem.innerHTML = `
                    <h3>${video.snippet.title}</h3>
                    <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${video.id.videoId}" allowfullscreen></iframe>
                `;
                videoContainer.appendChild(videoItem);
            });

            videoPageToken = data.nextPageToken || "";
        } catch (error) {
            console.error("Error fetching videos:", error);
            alert("Error fetching video news. Please check your API key or try again later.");
        } finally {
            isFetching = false;
        }
    }

    // Toggle Between Text & Video News
    document.getElementById('video-news-button')?.addEventListener('click', () => {
        showingVideos = !showingVideos;
        if (showingVideos) {
            fetchVideos();
            document.getElementById('video-news-button').textContent = "Show Text News";
        } else {
            document.getElementById('news-container').classList.remove("hidden");
            document.getElementById('video-container').classList.add("hidden");
            document.getElementById('video-news-button').textContent = "Show Video News";
        }
    });

    // AI Summarization (Simple Text Extraction)
    function summarizeText(text) {
        let output = document.getElementById('summary-output');
        if (!text || text.trim() === "") {
            output.innerHTML = "⚠️ No article content available for summarization.";
            return;
        }

        let sentences = text.split('. ');
        let summary = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? "..." : "");
        output.innerHTML = "✅ AI Summary: <br>" + summary;
    }

    // Infinite Scroll Loading
    window.addEventListener('scroll', () => {
        if (isFetching) return; // Prevent multiple calls
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            if (showingVideos) {
                fetchVideos(true);
            } else {
                fetchNews(true);
            }
        }
    });

    // Fetch News Button
    document.getElementById('fetch-news')?.addEventListener('click', () => fetchNews());
});




document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    let newsPage = 1;
    let videoPageToken = "";
    let currentTopic = "";
    let showingVideos = false;
    let isFetching = false;

    // Secure API Keys (These should be stored in backend)
    const NEWS_API_KEY = "c1cb9b2e0106472fa6d18ecea65c18c6"; 
    const YOUTUBE_API_KEY = "AIzaSyD_nIPQldNLjCwQc8cl-ggMUYHfbj21u2g"; 

    // Fetch News Articles (Text News)
    async function fetchNews(loadMore = false) {
        let topic = document.getElementById('news-topic')?.value.trim();
        if (!topic) {
            alert("Please enter a news topic.");
            return;
        }

        if (!loadMore) {
            newsPage = 1;
            currentTopic = topic;
            document.getElementById('news-container').innerHTML = '';
            document.getElementById('video-container').innerHTML = '';
            document.getElementById('video-container').style.display = "none";
            document.getElementById('news-container').style.display = "block";
        }

        let apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&page=${newsPage}&pageSize=5&apiKey=${NEWS_API_KEY}`;

        try {
            isFetching = true;
            let response = await fetch(apiUrl);
            let data = await response.json();

            if (!data.articles || data.articles.length === 0) {
                alert("No more news found!");
                return;
            }

            let newsContainer = document.getElementById('news-container');

            data.articles.forEach(article => {
                let newsCard = document.createElement('div');
                newsCard.classList.add('news-article');
                newsCard.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description || "No description available."}</p>
                    <img src="${article.urlToImage || 'placeholder.jpg'}" alt="News Image">
                    <p><strong>Source:</strong> ${article.source.name}</p>
                `;

                let readMoreBtn = document.createElement('button');
                readMoreBtn.textContent = "Read More";
                readMoreBtn.addEventListener('click', () => openArticle(article));
                newsCard.appendChild(readMoreBtn);

                let summarizeBtn = document.createElement('button');
                summarizeBtn.textContent = "Summarize";
                summarizeBtn.addEventListener('click', () => summarizeText(article.content));
                newsCard.appendChild(summarizeBtn);

                newsContainer.appendChild(newsCard);
            });

            newsPage++;
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            isFetching = false;
        }
    }

    // Open Article in New Tab
    function openArticle(article) {
        localStorage.setItem("selectedArticle", JSON.stringify(article));
        window.open("details.html", "_blank");
    }

    // Fetch Video News from YouTube
    async function fetchVideos(loadMore = false) {
        if (!currentTopic) {
            alert("Please enter a news topic and fetch news first!");
            return;
        }

        if (!loadMore) {
            videoPageToken = "";
            document.getElementById('video-container').innerHTML = '';
            document.getElementById('news-container').style.display = "none"; // Hide text news
            document.getElementById('video-container').style.display = "block"; // Show video news
        }

        let videoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(currentTopic)}+news&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
        if (videoPageToken) {
            videoUrl += `&pageToken=${videoPageToken}`;
        }

        try {
            isFetching = true;
            let response = await fetch(videoUrl);
            let data = await response.json();

            if (!data.items || data.items.length === 0) {
                alert("No video news found!");
                return;
            }

            let videoContainer = document.getElementById('video-container');

            data.items.forEach(video => {
                let videoItem = document.createElement('div');
                videoItem.classList.add('video-item');
                videoItem.innerHTML = `
                    <h3>${video.snippet.title}</h3>
                    <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${video.id.videoId}" allowfullscreen></iframe>
                `;
                videoContainer.appendChild(videoItem);
            });

            videoPageToken = data.nextPageToken || "";
        } catch (error) {
            console.error("Error fetching videos:", error);
            alert("Error fetching video news. Please check your API key or try again later.");
        } finally {
            isFetching = false;
        }
    }

    // Toggle Between Text & Video News
    document.getElementById('video-news-button')?.addEventListener('click', () => {
        showingVideos = !showingVideos;
        if (showingVideos) {
            fetchVideos();
            document.getElementById('video-news-button').textContent = "Show Text News";
        } else {
            document.getElementById('news-container').style.display = "block";
            document.getElementById('video-container').style.display = "none";
            document.getElementById('video-news-button').textContent = "Show Video News";
        }
    });

    // AI Summarization (Simple Text Extraction)
    function summarizeText(text) {
        let output = document.getElementById('summary-output');
        if (!text || text.trim() === "") {
            output.innerHTML = "⚠️ No article content available for summarization.";
            return;
        }

        let sentences = text.split('. ');
        let summary = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? "..." : "");
        output.innerHTML = "✅ AI Summary: <br>" + summary;
    }

    // Infinite Scroll Loading
    window.addEventListener('scroll', () => {
        if (isFetching) return; // Prevent multiple calls
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            if (showingVideos) {
                fetchVideos(true);
            } else {
                fetchNews(true);
            }
        }
    });

    // Attach event listener to Fetch News button
    document.getElementById('fetch-news')?.addEventListener('click', () => {
        showingVideos = false; // Reset to text news mode
        fetchNews();
        document.getElementById('video-news-button').textContent = "Show Video News";
    });
});
