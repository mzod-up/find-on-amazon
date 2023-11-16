// function to send GET request to server
const ajaxGet = (url, callback) => {
  const xhr = new XMLHttpRequest();

  // some error handling
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        callback(null, xhr.responseText);
      } else {
        callback("Error Status Code: " + xhr.status);
      }
    }
  };

  xhr.open("GET", url);
  xhr.send();
};

// selecting necessary html elements
const searchForm = document.getElementById("search-form");
const searchTerm = document.getElementById("search-term");
const results = document.getElementById("results");

// our server url
const serverURL = "http://localhost:5000";

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = searchTerm.value.trim(); // trim to remove trailing and leading whitespace

  // in case nothing was entered in the search bar
  if (keyword === "") {
    alert("Please enter a search term before searching.");
    return;
  }

  const url = `${serverURL}/api/scrape?keyword=${encodeURIComponent(keyword)}`; // encode in case special characters are used

  ajaxGet(url, (err, res) => {
    if (err) {
      results.innerHTML = `<p>An arror has occurred. ${err}`;
    } else {
      const data = JSON.parse(res);
      let products = `<p class="showing-results">
      Showing top results for <strong>"${keyword}"</strong>
    </p>`;
      for (const item of data) {
        products += `
        <div class="product-card">
          <img
            class="product-img"
            src="${item.imageUrl}"
          />
          <div class="product-right">
            <h2 class="product-name">
            ${item.name}
            </h2>
            <div class="rating-area">
              <i class="fa-solid fa-star"></i>
              <div class="product-rating">${item.rating}</div>
              <div class="product-reviews">(${item.reviewCount})</div>
            </div>
          </div>
        </div>
        `;
      }

      // putting the products code snippet inside the "results" div in the html
      results.innerHTML = `${products}`;
    }
  });
});
