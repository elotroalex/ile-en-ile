const search = document.getElementById("search");
const matchList = document.getElementById("match-list");

// Capture value of input box

search.addEventListener("input", () => searchList(search.value));

// Empty search box on unload

window.addEventListener("beforeunload", beforeUnloadListener, {
  capture: true,
});

async function beforeUnloadListener(event) {
  search.value = "";
}

// Search the list

async function searchList(searchText) {
  let raw = await fetch("data/index.json");
  let posts = await raw.json();
  let options = {
    includeMatches: true,
    threshold: 0.4,
    keys: ["Content", "Title"],
  };
  const myIndex = Fuse.createIndex(options.keys, posts)
  
  let f = new Fuse(posts, options, myIndex);
  let allResults = f.search(searchText);
  let topTenResults = allResults.slice(0,9);

  if (searchText.length == 0) {
    matchList.innerHTML = "";
  }

  outputHTML(topTenResults);
}

// Show topTenResults in HTML

function outputHTML(topTenResults) {
  if (topTenResults.length > 0) {
    const html = topTenResults
      .map(
        (match) => `
    <div class="card card-body mb-1">
      <h4><a href="${match.item.Permalink}">${match.item.Title}</a></h4>
      <small>${match.item.Content.substring(0, 120)}...</small>
    </div>
    `
      )
      .join("");

    matchList.innerHTML = html;
  }
}
