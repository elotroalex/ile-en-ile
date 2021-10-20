const search = document.getElementById("search");
const form = document.getElementById("search-form");
const matchList = document.getElementById("match-list");

// Capture value of input box

// search.addEventListener("keyup", function (event) {
//   if (event.keyCode === 13) {
//     event.preventDefault();
//     () => searchList(search.value);
//   }
// });

function handleForm(event) {
  event.preventDefault();
  searchList(search.value);
}
form.addEventListener("submit", handleForm);

// search.addEventListener("submit", (e) => searchList(search.value));

// Empty search box on unload

window.addEventListener("beforeunload", beforeUnloadListener, {
  capture: true,
});

async function beforeUnloadListener(event) {
  search.value = "";
}

// Spinner

var opts = {
  lines: 13, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 35, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: "spinner-line-fade-quick", // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: "#7ab1d2", // CSS color or array of colors
  fadeColor: "transparent", // CSS color or array of colors
  top: "75%", // Top position relative to parent
  left: "50%", // Left position relative to parent
  shadow: "0 0 1px transparent", // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: "spinner", // The CSS class to assign to the spinner
  position: "absolute", // Element positioning
};

var target = document.getElementById("spin-box");

// Search the list

async function searchList(searchText) {
  var spinner = new Spin.Spinner(opts).spin(target);

  let raw = await fetch("data/index.json");
  let posts = await raw.json();
  let options = {
    includeMatches: true,
    threshold: 0.3,
    keys: ["Content"],
  };

  const myIndex = Fuse.createIndex(options.keys, posts);

  let f = new Fuse(posts, options, myIndex);
  let allResults = f.search(searchText);
  let topTenResults = allResults.slice(0, 9);

  if (searchText.length == 0) {
    matchList.innerHTML = "";
  }

  outputHTML(topTenResults);
  spinner.stop();
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
