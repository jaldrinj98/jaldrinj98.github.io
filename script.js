const PASSWORD = "8/7/15"; // CHANGE THIS

function login() {
  const input = document.getElementById("password").value;
  if (input === PASSWORD) {
    document.getElementById("login").style.display = "none";
    document.getElementById("blog").style.display = "block";
  } else {
    document.getElementById("error").innerText = "Wrong password";
  }
}

function addPost() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) return;

  const article = document.createElement("article");
  article.innerHTML = `
    <h2>${title}</h2>
    <p class="date">${new Date().toDateString()}</p>
    <p>${content}</p>
  `;

  document.getElementById("posts").prepend(article);
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
}
