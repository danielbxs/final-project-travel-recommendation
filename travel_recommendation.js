let results = [];
const searchBtn = document.getElementById("searchBtn");
const searchInp = document.getElementById("searchInp");
const resetBtn = document.getElementById("resetBtn");
const searchResults = document.getElementById("searchResults");
const searchItemBox = document.querySelector(".search-item-box");

function getResults() {
  searchItemBox.innerHTML = "";
  const searchInp = document
    .getElementById("searchInp")
    .value.trim()
    .toLowerCase();

  fetch("travel_recommendation_api.json")
    .then((res) => res.json())
    .then((data) => {
      if (searchInp !== "" && searchInp.includes("countr")) {
        results = data.countries;

        displayResults(results, "country");
      } else if (searchInp !== "" && searchInp.includes("templ")) {
        results = data.temples;
        displayResults(results, "general");
      } else if (searchInp !== "" && searchInp.includes("beach")) {
        results = data.beaches;
        displayResults(results, "general");
      } else {
        results = data;

        const items =
          results.countries.find(
            (res) => searchInp === res.name.toLowerCase()
          ) ?? null;
        if (items) {
          displayResults(items.cities, "general");
        } else {
          resetResults();
          setTimeout(alert("Results not found for this keyword"), 1500);
        }
        return;
      }
    });
}

function populateResultHTML(result) {
  return `
    <div class="result-item">
            <div class="result-item-img-box">
              <img
                src="${result.imageUrl}" alt="${result.name}"
                class="result-item-img"
                
              />
            </div>
            <div class="result-item-details">
              <h3 class="result-item-name">${result.name}</h3>
              <p class="result-item-description">
              ${result.description}
              </p>
              <button class="result-item-btn btn">Visit</button>
            </div>
          </div>
    `;
}

function displayResults(items, keyword) {
  searchItemBox.innerHTML = "";
  if (items.length && keyword === "country") {
    items
      .map((item) => item.cities)
      .flat()
      .forEach((city) =>
        searchItemBox.insertAdjacentHTML("beforeend", populateResultHTML(city))
      );
  }
  if (items.length && keyword === "general") {
    items.forEach((result) => {
      searchItemBox.insertAdjacentHTML("beforeend", populateResultHTML(result));
    });
  }

  searchResults.classList.remove("hidden");
}

function resetResults() {
  searchResults.classList.add("hidden");
  searchItemBox.innerHTML = "";
  searchInp.value = "";
}

searchBtn.addEventListener("click", getResults);
resetBtn.addEventListener("click", resetResults);
