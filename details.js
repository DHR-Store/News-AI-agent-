


document.addEventListener("DOMContentLoaded", async () => {
  let article = localStorage.getItem("selectedArticle");
  if (article) {
    article = JSON.parse(article);
    document.getElementById("article-title").textContent = article.title;
    document.getElementById("article-image").src = article.urlToImage || "placeholder.jpg";
    document.getElementById("article-description").textContent = article.description || "";
    document.getElementById("article-content").textContent = article.content || "Full content not available.";
    document.getElementById("article-link").href = article.url;
  } else {
    document.body.innerHTML = "<h2>No article data available.</h2>";
  }
});

// **AI Summarization using TextRank Algorithm**
function summarizeArticle() {
  let content = document.getElementById("article-content").textContent;
  let output = document.getElementById("summary-output");

  if (!content || content.trim() === "") {
    output.innerHTML = "⚠️ No article content available for summarization.";
    return;
  }

  let sentences = content.split(". ");
  let sentenceScores = {};

  // **Step 1: Score sentences based on word frequency**
  let wordFrequencies = {};
  let words = content.toLowerCase().match(/\b(\w+)\b/g);

  words.forEach(word => {
    if (!wordFrequencies[word]) wordFrequencies[word] = 0;
    wordFrequencies[word]++;
  });

  sentences.forEach(sentence => {
    let sentenceWords = sentence.toLowerCase().match(/\b(\w+)\b/g) || [];
    sentenceScores[sentence] = sentenceWords.reduce((sum, word) => sum + (wordFrequencies[word] || 0), 0);
  });

  // **Step 2: Select Top Sentences**
  let sortedSentences = Object.entries(sentenceScores).sort((a, b) => b[1] - a[1]);
  let topSentences = sortedSentences.slice(0, Math.min(3, sortedSentences.length)).map(s => s[0]);

  output.innerHTML = "✅ AI Summary: <br>" + topSentences.join(". ") + ".";
}

// **Text-to-Speech AI**
function readAloud() {
  let content = document.getElementById("summary-output").textContent || document.getElementById("article-content").textContent;
  let speech = new SpeechSynthesisUtterance(content);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

// **Auto-Publish Article**
function publishToBlog() {
  let article = {
    title: document.getElementById("article-title").textContent,
    image: document.getElementById("article-image").src,
    summary: document.getElementById("summary-output").textContent,
    content: document.getElementById("article-content").textContent,
    link: document.getElementById("article-link").href,
  };

  let savedArticles = JSON.parse(localStorage.getItem("publishedArticles")) || [];
  savedArticles.push(article);
  localStorage.setItem("publishedArticles", JSON.stringify(savedArticles));

  alert("✅ Article Published! Visit the blog page.");
  window.open("blog.html", "_blank");
}

// **Social Media Sharing**
function shareOnWhatsApp() {
  let title = document.getElementById("article-title").textContent;
  let url = document.getElementById("article-link").href;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, "_blank");
}

function shareOnTwitter() {
  let title = document.getElementById("article-title").textContent;
  let url = document.getElementById("article-link").href;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
}

function shareOnFacebook() {
  let url = document.getElementById("article-link").href;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
}

function shareOnLinkedIn() {
  let title = document.getElementById("article-title").textContent;
  let url = document.getElementById("article-link").href;
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
}