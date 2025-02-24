document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

let newsData = {}; // Store news details globally
let newsPage = 1;
let videoPage = "";
let currentTopic = "";
let isFetching = false;
let showingVideos = false;

// **Fetch News Articles using GNews API**
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
        document.getElementById('video-container').style.display = "none";
    }

    let apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&max=5&page=${newsPage}&apikey=3628c12e5f5c5fb9a037739563d732ff`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            alert("No more news found!");
            return;
        }

        let newsContainer = document.getElementById('news-container');

        data.articles.forEach((article, index) => {
            let summary = summarizeText(article.description || article.content || "No description available.", 2);

            newsData[index] = {
                title: article.title,
                content: article.content,
                image: article.image,
                source: article.source.name,
                url: article.url
            };

            let newsCard = document.createElement('div');
            newsCard.classList.add('news-article');
            newsCard.innerHTML = `
                <h3>${article.title}</h3>
                <p>${summary}</p>
                <img src="${article.image || 'placeholder.jpg'}" alt="News Image">
                <p><strong>Source:</strong> ${article.source.name}</p>
                <button onclick="openDetails(${index})">Read More</button>
                <button onclick="readSummary('${summary}')">🔊 Listen</button>
                <button onclick="shareSummary('${summary}')">📤 Share</button>
            `;
            newsContainer.appendChild(newsCard);
        });

        newsPage++;
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// **Summarizer**
function summarizeText(text, sentenceCount = 2) {
    let sentences = text.match(/[^.!?]+[.!?]/g) || [text];
    if (sentences.length <= sentenceCount) return text;

    let wordFreq = {};
    let stopWords = new Set(["is", "the", "and", "to", "of", "in", "a", "that", "on"]);
    let words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);

    words.forEach(word => {
        if (!stopWords.has(word)) wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    let sentenceScores = sentences.map(sentence => {
        let score = sentence.split(/\s+/).reduce((acc, word) => acc + (wordFreq[word] || 0), 0);
        return { sentence, score };
    });

    sentenceScores.sort((a, b) => b.score - a.score);
    return sentenceScores.slice(0, sentenceCount).map(s => s.sentence).join(" ");
}

// **Speech Synthesis**
function readSummary(summary) {
    let speech = new SpeechSynthesisUtterance(summary);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}

// **Social Media Sharing**
function shareSummary(summary) {
    let text = encodeURIComponent(summary);
    let url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
}

// **Open News Details Page**
function openDetails(index) {
    let article = newsData[index];
    let detailsUrl = `news_details.html?title=${encodeURIComponent(article.title)}&content=${encodeURIComponent(article.content)}&image=${encodeURIComponent(article.image)}&source=${encodeURIComponent(article.source)}&url=${encodeURIComponent(article.url)}`;
    window.open(detailsUrl, "_blank");
}

// **Fetch Video News**
async function fetchVideoNews(loadMore = false) {
    if (!currentTopic) return;

    if (!loadMore) {
        videoPage = "";
        document.getElementById('video-container').innerHTML = '';
        document.getElementById('news-container').style.display = "none";
        document.getElementById('video-container').style.display = "flex";
    }

    let videoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(currentTopic)}+news&type=video&maxResults=5&pageToken=${videoPage}&key=AIzaSyD5pdTrhUdSQGCjrLoErNTUWZK4MNvqK7g`;

    try {
        let response = await fetch(videoUrl);
        let data = await response.json();

        let videoContainer = document.getElementById('video-container');

        data.items.forEach(video => {
            let videoItem = document.createElement('div');
            videoItem.classList.add('video-item');
            videoItem.innerHTML = `
                <h3>${video.snippet.title}</h3>
                <iframe src="https://www.youtube.com/embed/${video.id.videoId}" allowfullscreen></iframe>
            `;
            videoContainer.appendChild(videoItem);
        });

        videoPage = data.nextPageToken || ""; 
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
}

// **Toggle Between Text & Video News**
document.getElementById('video-news-button').addEventListener('click', () => {
    showingVideos = !showingVideos;
    if (showingVideos) {
        fetchVideoNews();
        document.getElementById('video-news-button').textContent = "Show Text News";
    } else {
        document.getElementById('news-container').style.display = "flex";
        document.getElementById('video-container').style.display = "none";
        document.getElementById('video-news-button').textContent = "Show Video News";
    }
});

// **Infinite Scrolling**
window.addEventListener('scroll', () => {
    let scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    let scrolled = window.scrollY;

    if (scrolled >= scrollableHeight - 50 && !isFetching) {
        isFetching = true;
        document.getElementById('loading-message').style.display = "block";

        if (showingVideos) {
            fetchVideoNews(true).then(() => {
                isFetching = false;
                document.getElementById('loading-message').style.display = "none";
            });
        } else {
            fetchNews(true).then(() => {
                isFetching = false;
                document.getElementById('loading-message').style.display = "none";
            });
        }
    }
});

// **Translation Using Google Translate API**
function translateSummary(text, targetLang = "hi") {
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => alert("Translated: " + data[0][0][0]))
        .catch(err => console.error("Translation Error:", err));
}