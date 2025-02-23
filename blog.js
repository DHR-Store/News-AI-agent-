document.addEventListener('DOMContentLoaded', () => {
  let blogContainer = document.getElementById('blog-container');
  let articles = JSON.parse(localStorage.getItem("publishedArticles")) || [];

  if (articles.length === 0) {
    blogContainer.innerHTML = "<h3>No articles published yet.</h3>";
    return;
  }

  articles.forEach(article => {
    let articleCard = document.createElement('div');
    articleCard.classList.add('news-article');
    articleCard.innerHTML = `
      <h3>${article.title}</h3>
      <img src="${article.image}" alt="News Image">
      <p>${article.summary}</p>
      <a href="${article.link}" target="_blank">Read More</a>
    `;
    blogContainer.appendChild(articleCard);
  });
});