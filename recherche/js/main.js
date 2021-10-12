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
  let books = await raw.json();
  let options = {
    includeMatches: true,
    keys: ["Content"],
  };
  let f = new Fuse(books, options);
  let results = f.search(searchText);

  if (searchText.length == 0) {
    matchList.innerHTML = "";
  }

  outputHTML(results);
}

// async function searchList(searchText) {
//   const raw = await fetch("data/list.json");
//   const books = await raw.json();
//   const options = {
//     keys: ["author.lastName"],
//   };
//   const f = new Fuse(books, options);
//   const results = f.search(searchText);

//   if (searchText.length == 0) {
//     matchList.innerHTML = "";
//   }

//   outputHTML(results);
// }

// Show results in HTML

function outputHTML(results) {
  if (results.length > 0) {
    const html = results
      .map(
        (match) => `
    <div class="card card-body mb-1">
      <h4><a href="${match.item.Permalink}">${match.item.Title}</a></h4>
      <small>${match.item.Content.substring(0, 200)}</small>
    </div>
    `
      )
      .join("");

    matchList.innerHTML = html;
  }
}

// function outputHTML(results) {
//   if (results.length > 0) {
//     const html = results
//       .map(
//         (match) => `
//     <div class="card card-body mb-1">
//       <h4><a href="#">${match.item.title}</a></h4>
//       <small>by ${match.item.author.firstName} ${match.item.author.lastName}</small>
//     </div>
//     `
//       )
//       .join("");

//     matchList.innerHTML = html;
//   }
// }
